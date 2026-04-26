const express = require("express");
const app = express();
const data = require("./data");
const config = require("./constants");
const dotenv = require("dotenv");
dotenv.config();

data.initializePageViews(config.tools);

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/:key", async (req, res, next) => {
    const file = await data.getFileByKey(req.params.key);
    console.log(file);
    if (file) {
        return res.render("toolbox/temp-file-upload-view", { ...file, config, page: file.filename, file_size_formatted: data.formatSize(file.file_size) });
    }
    
    const redirect = await data.getRedirect(req.params.key);
    console.log(redirect);
    if (redirect) {
        return res.redirect(redirect.target_url);
    }

    return next();
});

app.use(express.static("public"));

const discoverRouter = require("./routes/discover");
app.use("/", discoverRouter);

const toolboxRouter = require("./routes/toolbox");
app.use("/toolbox", toolboxRouter);

const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})