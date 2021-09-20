const express     = require("express");
const passport    = require("passport");
const { ObjectID } = require("mongodb");
const User        = require("../models/user");
const Message     = require("../models/message");
const middleware  = require("../middleware/index");


const     router = express.Router();

router.get("/login", (req, res)=>{
    res.render("login", { title: "Login" });
});

router.post("/login", passport.authenticate("local-login", { failureRedirect: "/users/register" }), (req, res)=>{
   User.findById(req.user._id).then((rUser)=>{
    rUser.online = true;
    rUser.save();
   });
   res.redirect("/users/@me");
});

router.get("/register", (req, res)=>{
    console.log(req.flash("error"));
    res.render("register", { title: "Register" });
});

router.post("/register", passport.authenticate("local-signup", {
    failureRedirect: "/users/register", // redirect back to the signup page if there is an error
    failureFlash: true,
}), (req, res)=>{
    User.findById(req.user._id).then((rUser)=>{
        rUser.online = true;
        rUser.save();
       });
       res.redirect("/users/@me");
});

router.get("/logout", middleware.isLogedIn, (req, res)=>{
    User.findById(req.user._id).then((rUser)=>{
        rUser.online = false;
        rUser.save();
       });
    req.logout();
    res.redirect("/");
});


// Users Profile
router.get("/@me", middleware.isLogedIn, (req, res)=>{
    User.findById(req.user._id).populate("channels").then((rUser)=>{
        res.render("profile", { channels: rUser.channels, title: "username" });
    }).catch((e)=>{
        res.send(e);
    });
});

router.get("/admin", middleware.isLogedIn, (req, res)=>{
 if (req.user._id == "6144e1709d2e8102b4a357ff"){
   res.render("admin", { title: "admin" });
 }else if (req.user._id == "6145062c59b4ce03a7494004"){
res.render("admin", { title: "admin" });
 }else{
   res.send("you dont have perms to view this page")
 }
})
//router.get("/settings", middleware.isLogedIn, (req, res)=>{
//	res.redirect("/users/settings/friends");
//});


router.get("/settings", middleware.isLogedIn, (req, res)=>{
    User.findById(req.user._id).populate("channels").then((rUser)=>{
        res.render("Settings", { title: "Settings" });
    }).catch((e)=>{
        res.send(e);
    });
});

router.get("/settings/friends", middleware.isLogedIn, (req, res)=>{
    User.findById(req.user._id).populate("channels").then((rUser)=>{
        res.render("settings-friends", { title: "Settings" });
    }).catch((e)=>{
        res.send(e);
    });
});

router.get("/settings/account", middleware.isLogedIn, (req, res)=>{
    User.findById(req.user._id).populate("channels").then((rUser)=>{
        res.render("settings-account", { title: "Settings" });
    }).catch((e)=>{
        res.send(e);
    });
});

router.get("/settings/change-log", middleware.isLogedIn, (req, res)=>{
    User.findById(req.user._id).populate("channels").then((rUser)=>{
        res.render("change-log", { title: "Change Log" });
    }).catch((e)=>{
        res.send(e);
    });
});


// external user Profile
router.get("/:id", middleware.isLogedIn, (req, res)=>{
    User.findById(req.user._id).populate("channels").then((currentUser)=>{
        User.findById(req.params.id).populate("channels").then((rUser)=>{
            if(ObjectID(req.params.id).equals(ObjectID(req.user._id))){
                res.redirect("@me");
            }
            res.render("external_profile", {
                 currentUserChannels: currentUser.channels,
                 channels: rUser.channels,
                 title: "username",
                 user: rUser,
                });
        }).catch((e)=>{
            res.send(e);
        });
    });
});



router.patch("/@me/update", middleware.isLogedIn, (req, res)=>{
    User.findByIdAndUpdate(req.user._id, req.body.user).then(()=>{
        res.redirect("/users/@me");
    }).catch((e)=>{
        console.log(e);
        return res.redirect("/user/@me");
    });
});


module.exports = router;
