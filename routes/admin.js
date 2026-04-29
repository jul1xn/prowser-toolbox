const express = require("express");
const config = require("../constants");
const router = express.Router();
const dotenv = require("dotenv");
const data = require("../data");
dotenv.config();

const adminMiddleware = async (req, res, next) => {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) await res.status(500).json({ error: "Internal Server Error (Password does not exist)" });

    if (!req.cookies.admin_password || req.cookies.admin_password.trim() !== password) {
        if (req.accepts('html')) {
            await res.redirect(`/admin/login`);
            return;
        }

        await res.status(403).json({ error: "Forbidden" });
    }

    next();
}

async function loginErrorStatus(code, error, req, res) {
    if (req.accepts('html')) {
        await res.redirect(`/admin/login?error=${encodeURIComponent(error)}`);
    }

    await res.status(code).json({ error: error });
}

router.route('/login')
    .get(async (req, res) => {
        const error = req.query.error ?? null;
        await res.render('admin/login', { page: "Admin login", config, error });
    })
    .post(async (req, res) => {
        if (!req.body) {
            await loginErrorStatus(400, "Invalid request", req, res);
            return;
        }

        if (!req.body.password) {
            await loginErrorStatus(400, "Invalid request", req, res);
            return;
        }

        const password = process.env.ADMIN_PASSWORD;
        if (!password) await res.status(500).json({ error: "Internal Server Error (Password does not exist)" });

        const user_password = req.body.password.trim();
        if (user_password !== password) {
            await loginErrorStatus(403, "Invalid password", req, res);
            return;
        }

        res.cookie('admin_password', password, {
            maxAge: 3600000,
            httpOnly: true,
            secure: true
        });
        await res.redirect("/admin/dashboard");
    });

router.get('/dashboard', adminMiddleware, async (req, res) => {
    const page = (req.query.page ?? "links").toLowerCase().trim();
    let rowData = [];
    if (page === "links") {
        rowData = await data.getAllRedirects();
    }
    else if (page === "files") {
        rowData = await data.getAllFiles();
        console.log(rowData);
    }

    await res.render("admin/dashboard", {config, page: "Admin dashboard", data: rowData, type: page});
})

router.get('/', adminMiddleware, async (req, res) => await res.redirect('/admin/dashboard'));

module.exports = router;