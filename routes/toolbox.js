const express = require("express");
const router = express.Router();
const config = require("../constants");

router.get("/", (req, res) => {
    let filteredTools = config.tools;
    if (req.query && req.query.q) {
        const searchQuery = req.query.q
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
            
        const pattern = searchQuery.join(".*");
        const regex = new RegExp(pattern, "i");
        filteredTools = filteredTools.filter(tool =>
            regex.test(tool.name.toLowerCase())
        );
    }

    res.render("toolbox", { page: "Tools", tools: filteredTools, config: config, search: req.query.q ?? "" });
});

config.tools.forEach(tool => {
    router.get("/" + tool.url, async (req, res) => {
        let extraData = {};

        if (tool.handler) {
            extraData = await tool.handler(req);
        }

        res.render(`toolbox/${tool.view}`, {
            page: tool.name,
            tool: tool,
            config: config,
            request: req,
            ...extraData
        });
    });
});

module.exports = router;