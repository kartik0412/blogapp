var express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    methoOverride = require("method-override"),
    mongoose = require("mongoose"),
    bodySanitizer = require("express-sanitizer"),
    User = require("./models/user.js"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    flash = require("connect-flash");

mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodySanitizer());
app.use(methoOverride("_method"));
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(require("express-session")({
    secret: "keyword cat",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(function(req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

var blogsRoutes = require("./router/blogs"),
    authRoutes = require("./router/authentication");

app.use(blogsRoutes);
app.use(authRoutes);

app.listen(3000||process.env.PORT, process.env.IP, function() {
    console.log("Server is running!!");
});