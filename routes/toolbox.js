const express = require("express");
const router = express.Router();
const config = require("../constants");

router.get("/", (req, res) => {
    res.render("toolbox", {page: "Tools", tools: config.tools, config: config});
});

config.tools.forEach(tool => {
    router.get("/" + tool.url, (req, res) => {
        res.render(`toolbox/${tool.view}`, {page: tool.name, tool: tool, config: config});
    });
});

module.exports = router;