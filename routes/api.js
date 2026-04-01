const express = require("express");
const router = express.Router();
const config = require("../constants");

router.get("/tools", (req, res) => {
    res.json(config.tools);
});

module.exports = router;