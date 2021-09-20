const express     = require("express");
const multer = require("multer");
const mime = require("mime-types");
const path = require("path");
const crypto = require("crypto");
const middleware  = require("../middleware/index");

const router      = express.Router();

router.get("/settings", middleware.isLogedIn, (req, res)=>{
    User.findById(req.user._id).populate("channels").then((rUser)=>{
        res.render("settings", { channels: rUser.channels, title: "username" });
    }).catch((e)=>{
        res.send(e);
    });
});