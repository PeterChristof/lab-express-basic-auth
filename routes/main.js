const router = require("express").Router();
// const main = require("../models/User.model");

function requireLogin(req, res, next) {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect("/login");
    }
}


router.get("/main", requireLogin, (req, res) => {
     res.render("main");  
     });

module.exports = router;
