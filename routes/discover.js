const express = require("express");
const router = express.Router();
const config = require("../constants");
const data = require('../data');

router.get("/", async (req, res) => {
    const popularTools = await data.getMostPopularTools();

    const tools = popularTools.map(row => {
        const fullTool = config.tools.find(t => t.url === row.tool_url);

        if (!fullTool) return null;

        return {
            ...fullTool,
            views: row.count
        };
    }).filter(Boolean);

    res.render("discover", {
        page: "Home",
        config: config,
        tools
    });
});

module.exports = router;