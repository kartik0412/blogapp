var mongoose = require("mongoose"),
    passportLocalmongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    blog: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    }]
});

UserSchema.plugin(passportLocalmongoose);

module.exports = new mongoose.model("User", UserSchema);