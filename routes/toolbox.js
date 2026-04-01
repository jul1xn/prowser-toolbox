const express = require("express");
const router = express.Router();
const config = require("../constants");

router.get("/", (req, res) => {
    res.render("toolbox", {page: "Tools", config: config});
});

module.exports = router;