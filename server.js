const express = require("express")
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const discoverRouter = require("./routes/discover");
app.use("/", discoverRouter);

const toolboxRouter = require("./routes/toolbox");
app.use("/toolbox", toolboxRouter);

app.listen(8080, () => {
    console.log("Listening on http://localhost:8080");
})