var Blog = require("../models/blog.js"),
    User = require("../models/user.js"),
    express = require("express"),
    bodySanitizer = require("express-sanitizer"),
    router = express.Router();

router.get("/", function(req, res) {
    res.redirect("/blogs");
});

router.get("/blogs", function(req, res) {
    Blog.find({}, function(error, blogs) {
        if (error) console.log(error);
        else res.render("./blogs/index", {
            blogs: blogs
        });
    });
});

router.get("/profile/:id", function(req, res) {
    User.findById(req.params.id).populate("blog").exec(function(error, founduser) {
        if (error) {
            console.log(error);
            res.redirect("back");
        } else {
            res.render("./blogs/profile", {
                User: founduser
            });
        }
    });
});

router.post("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    author = {
        id: req.user._id,
        username: req.user.username
    };
    req.body.blog.author = author;
    if (req.body.blog.image.length == 0) req.body.blog.image = "https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/picture-256.png";
    Blog.create(req.body.blog, function(error, blog) {
        if (error) {
            console.log(error);
            res.redirect("back");
        } else {
            User.findById(req.params.id, function(error, founduser) {
                if (error) {
                    console.log(error);
                } else {
                    founduser.blog.push(blog._id);
                    founduser.save();
                    res.redirect("/blogs");
                }
            });
        }
    })
});

router.get("/blogs/new", isLoggedin, function(req, res) {
    res.render("./blogs/new");
});

router.get("/blogs/:id/edit", checkownership, function(req, res) {
    Blog.findById(req.params.id, function(error, foundblog) {
        if (error) {
            console.log(error);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            res.render("./blogs/edit", {
                blog: foundblog
            });
        }
    });
});

router.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(error, foundblog) {
        if (error || foundblog == null) {
            console.log(error);
            req.flash("error", "Blog not found!");
        } else {
            res.render("./blogs/show", {
                blog: foundblog
            });
        }
    });
});

router.put("/blogs/:id", checkownership, function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(error, updatedblog) {
        req.flash("success", "Blog updated!")
        res.redirect("/blogs/" + req.params.id);
    });
});

router.delete("/blogs/:id", checkownership, function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(error) {
        req.flash("success", "Blog deleted!");
        res.redirect("/blogs");
    })
});

function isLoggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "You are not Logged in");
        res.redirect("/login");
    }
}

function checkownership(req, res, next) {
    if (req.isAuthenticated()) {
        Blog.findById(req.params.id, function(error, foundblog) {
            if (error) {
                console.log(error);
                req.flash("error", "Blog not found");
                res.redirect("/blogs");
            } else {
                if (foundblog.author.id.equals(req.user._id)) next();
                else {
                    req.flash("error", "Access Denied");
                    res.redirect("/blogs");
                }
            }

        });
    } else {
        req.flash("error", "You are not Logged in");
        res.redirect("/login");
    }
}

module.exports = router;