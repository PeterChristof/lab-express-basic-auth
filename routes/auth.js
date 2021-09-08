const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/signup", (req, res) => {
    res.render("auth/signup");
});

router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
if (username === "" || password === "") {
res.render("auth/signup", { errorMessage: "Fill username and password" });
return;
}

const user = await User.findOne({ username });
if (user !== null) { //found the user, it already exists
res.render("auth/signup", { errorMessage: "User already exists" });
return;
}

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashedPassword = bcrypt.hashSync (password, salt);
await User.create({
    username, //when you don't have the same key and value we don't have to write username: username
    password: hashedPassword,
});
res.redirect("/");
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (username === "" || password === "") {
        res.render("auth/login", { errorMessage: "Fill username and password" });
        return;
        }

    const user = await User.findOne({ username });
if (user === null) {
res.render("auth/login", { errorMessage: "Invalid Login" });
return;
}

if (bcrypt.compareSync(password, user.password)) {
    //passwords match - login successfull
    req.session.currentUser = user;
    res.redirect("/");
} else {
    res.render("auth/login", { errorMessage: "Invalid Login" });
}
});

router.post("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;