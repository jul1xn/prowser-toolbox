const express = require("express");
const router = express.Router();
const config = require("../constants");
const multerUpload = require("../multer");
const path = require("path");
const fs = require("fs");
const { addUpload, getFileByKey, addRedirect } = require("../data");

router.get("/tools", (req, res) => {
    res.json(config.tools);
});

router.post("/create-redirect", async (req, res) => {
    if (!req.body) {
        return res.status(400).send("Invalid request");
    }

    if (!req.body.url || !req.body.time) {
        return res.status(400).send("Invalid request");
    }

    const { url, time } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    try {
        const result = await addRedirect(url, time, ip);
        res.redirect(`/toolbox/url-shortener?url=${result.shortKey}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
})

router.post("/file-upload", multerUpload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    const filename = req.file.filename;
    const uploadedAt = Date.now();
    const expiresAt = uploadedAt + (60 * 60 * 1000); // 1 hour
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
        const result = await addUpload(filename, uploadedAt, expiresAt, req.file.size, ip);
        res.redirect(`/toolbox/temp-file-upload?file=${result.fileKey}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

router.get("/files/:key", async (req, res) => {
    const data = await getFileByKey(req.params.key);
    if (data.filename) {
        const filePath = path.join(__dirname, '../uploads', data.filename);
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${data.filename}"`
        );

        return res.sendFile(filePath);
    }
})

module.exports = router;