const sqlite3 = require('sqlite3').verbose();
const config = require('./constants');
const path = require('path');
const db = new sqlite3.Database(path.resolve(__dirname, 'data.db'));

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS page_views (
            tool_url TEXT PRIMARY KEY,
            count INTEGER DEFAULT 0
        )
    `);
});

db.serialize(() => {
    const stmt = db.prepare(`
            INSERT OR IGNORE INTO page_views (tool_url, count)
            VALUES (?, 0)
        `);

    config.tools.forEach(tool => {
        stmt.run(tool.url);
    });

    stmt.finalize();
});

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

function getMostPopularTools(limit = 5) {
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

module.exports = { UpdatePageViews, getPageViewsAsync, canCountView, getMostPopularTools };