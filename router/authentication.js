var User = require("../models/user.js"),
    express = require("express"),
    passport=require("passport"),
    router = express.Router();

router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            req.flash("error", "Username is not available");
            return res.redirect("register");
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome " + user.username);
                res.redirect("/blogs");
            });
        }
    });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}), function(req, res) {});

router.get("/register", function(req, res) {
    res.render("register");
});

router.get("/login", function(req, res) {
    res.render("login");
});


router.get('/logout', function(req, res) {
    req.logout();
    req.flash("success", "You have been Logged Out!");
    res.redirect("/blogs");
});

module.exports = router;