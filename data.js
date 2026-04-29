const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require("fs");
const db = new sqlite3.Database(path.resolve(__dirname, 'data.db'));

function cleanupExpiredRedirects() {
    db.run(
        `DELETE FROM redirects WHERE expires_at < ?`,
        [Date.now()]
    );
}

function cleanupExpiredUploads() {
    db.run(
        `DELETE FROM uploads WHERE expires_at < ?`,
        [Date.now()]
    );
}

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS page_views (
            tool_url TEXT PRIMARY KEY,
            count INTEGER DEFAULT 0
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS uploads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_addr TEXT NOT NULL,
            usages INTEGER NOT NULL DEFAULT 0,
            filename TEXT NOT NULL,
            file_key TEXT UNIQUE NOT NULL,
            uploaded_at INTEGER NOT NULL,
            expires_at INTEGER NOT NULL,
            file_size INTEGER NOT NULL DEFAULT 0
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS redirects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usages INTEGER NOT NULL DEFAULT 0,
            ip_addr TEXT NOT NULL,
            short_key TEXT UNIQUE NOT NULL,
            target_url TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            expires_at INTEGER NOT NULL
        )
    `);

    cleanupExpiredUploads();
    cleanupExpiredRedirects();
});

function scheduleFileDeletion(fileKey, filename, delayMs = 60 * 60 * 1000) {
    console.log("Scheduling file deletion in", delayMs, "ms for key", fileKey);
    setTimeout(async () => {
        try {
            const filePath = path.join(__dirname, "uploads", filename);

            // delete file from disk
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log("Deleted file:", filename);
            }

            // delete DB record
            db.run(
                `DELETE FROM uploads WHERE file_key = ?`,
                [fileKey],
                (err) => {
                    if (err) {
                        console.error("DB delete error:", err);
                    } else {
                        console.log("Deleted DB record:", fileKey);
                    }
                }
            );

        } catch (err) {
            console.error("Scheduled deletion error:", err);
        }
    }, delayMs);
}

function initializePageViews(tools) {
    db.serialize(() => {
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO page_views (tool_url, count)
            VALUES (?, 0)
        `);

        tools.forEach(tool => {
            stmt.run(tool.url);
        });

        stmt.finalize();
    });
}

function UpdatePageViews(tool_url, amount) {
    db.run(`
        INSERT INTO page_views (tool_url, count)
        VALUES (?, ?)
        ON CONFLICT(tool_url)
        DO UPDATE SET count = count + ?
    `, [tool_url, amount, amount], (err) => {
        if (err) {
            console.error('Error updating page views:', err);
        }
    });
}

function getPageViewsAsync(tool_url) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT count FROM page_views WHERE tool_url = ?`,
            [tool_url],
            (err, row) => {
                if (err) return reject(err);
                resolve(row ? row.count : 0);
            }
        );
    });
}

function getMostPopularTools(limit = 4) {
    return new Promise((resolve, reject) => {
        db.all(
            `
            SELECT tool_url, count
            FROM page_views
            ORDER BY count DESC, tool_url ASC
            LIMIT ?
            `,
            [limit],
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }
        );
    });
}

function addUpload(filename, uploadedAt, expiresAt, fileSize, ip_addr) {
    return new Promise((resolve, reject) => {
        const fileKey = generateFileKey();

        db.run(
            `INSERT INTO uploads (ip_addr, filename, file_key, uploaded_at, expires_at, file_size)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [ip_addr, filename, fileKey, uploadedAt, expiresAt, fileSize],
            function (err) {
                if (err) return reject(err);

                scheduleFileDeletion(fileKey, filename, 60 * 60 * 1000);

                resolve({
                    id: this.lastID,
                    fileKey
                });
            }
        );
    });
}

// (optional) fetch uploads later
function getUploads() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM uploads ORDER BY id DESC`, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

function getFileByKey(fileKey) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM uploads WHERE file_key = ?`,
            [fileKey],
            (err, row) => {
                if (err) return reject(err);
                resolve(row);
            }
        );
    });
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function generateFileKey(length = 16) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}

const viewCooldowns = new Map(); // key = `${ip}:${tool}`

function canCountView(ip, tool_url) {
    const key = `${ip}:${tool_url}`;
    const now = Date.now();

    const lastTime = viewCooldowns.get(key);

    if (lastTime && now - lastTime < 30 * 1000) {
        return false;
    }

    viewCooldowns.set(key, now);
    return true;
}

function getAllFiles(limit = 100) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM uploads ORDER BY uploaded_at LIMIT ?`,
            [limit],
            (err, rows) => {
                if (err) return reject(err);

                if (!rows) return resolve(null);

                resolve(rows);
            }
        );
    });
}

function getAllRedirects(limit = 100) {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM redirects ORDER BY created_at LIMIT ?`,
            [limit],
            (err, rows) => {
                if (err) return reject(err);

                if (!rows) return resolve(null);

                resolve(rows);
            }
        );
    });
}

function addRedirect(targetUrl, expiresInSeconds, ip_address) {
    return new Promise((resolve, reject) => {
        const shortKey = generateFileKey(8);
        const now = Date.now();
        const expiresAt = now + (parseInt(expiresInSeconds) * 1000);

        db.run(
            `INSERT INTO redirects (short_key, ip_addr, target_url, created_at, expires_at)
             VALUES (?, ?, ?, ?, ?)`,
            [shortKey, ip_address, targetUrl, now, expiresAt],
            function (err) {
                if (err) return reject(err);

                scheduleRedirectDeletion(shortKey, expiresAt - now);

                resolve({
                    id: this.lastID,
                    shortKey
                });
            }
        );
    });
}

function getRedirect(shortKey) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT short_key, target_url, created_at, expires_at FROM redirects WHERE short_key = ?`,
            [shortKey],
            (err, row) => {
                if (err) return reject(err);

                if (!row) return resolve(null);

                // check expiration
                if (Date.now() > row.expires_at) {
                    deleteRedirect(shortKey);
                    return resolve(null);
                }

                resolve(row);
            }
        );
    });
}

function incrementRedirectUsage(shortKey) {
    return new Promise((resolve, reject) => {
        db.run(
            `
            UPDATE redirects
            SET usages = usages + 1
            WHERE short_key = ?
            `,
            [shortKey],
            function (err) {
                if (err) return reject(err);

                // this.changes = number of rows affected
                resolve(this.changes > 0);
            }
        );
    });
}

function incrementUploadUsage(fileKey) {
    return new Promise((resolve, reject) => {
        db.run(
            `
            UPDATE uploads
            SET usages = usages + 1
            WHERE file_key = ?
            `,
            [fileKey],
            function (err) {
                if (err) return reject(err);

                // this.changes = number of rows affected
                resolve(this.changes > 0);
            }
        );
    });
}

function scheduleRedirectDeletion(shortKey, delayMs) {
    setTimeout(() => {
        deleteRedirect(shortKey);
    }, delayMs);
}

function deleteRedirect(shortKey) {
    db.run(
        `DELETE FROM redirects WHERE short_key = ?`,
        [shortKey],
        (err) => {
            if (err) {
                console.error("Redirect delete error:", err);
            } else {
                console.log("Deleted redirect:", shortKey);
            }
        }
    );
}

module.exports = { getAllFiles, incrementUploadUsage, incrementRedirectUsage, getRedirect, getAllRedirects, deleteRedirect, addRedirect, UpdatePageViews, getPageViewsAsync, canCountView, getMostPopularTools, addUpload, getUploads, getFileByKey, initializePageViews, formatSize };