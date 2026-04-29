const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const data = require("./data");
const config = require("./constants");
const dotenv = require("dotenv");
dotenv.config();

data.initializePageViews(config.tools);

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.get("/:key", async (req, res, next) => {
    const file = await data.getFileByKey(req.params.key);
    if (file) {
        await data.incrementUploadUsage(file.file_key);
        return res.render("toolbox/temp-file-upload-view", { ...file, config, page: file.filename, file_size_formatted: data.formatSize(file.file_size) });
    }
    
    const redirect = await data.getRedirect(req.params.key);
    if (redirect) {
        await data.incrementRedirectUsage(redirect.short_key);
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

const adminRouter = require("./routes/admin");
app.use("/admin", adminRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})