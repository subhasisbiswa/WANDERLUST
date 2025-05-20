const express=require("express");
const router=express.Router();
const user=require("../models/user.js")
const asyncwarp=require("../utils/asyncwarp.js");
const passport = require("passport");
const {saveredirectpath}=require("../middlewire.js")
const usercontroller=require("../controllers/user.js")


//  router.get("/",usercontroller.signupform)

//  router.post("/",asyncwarp(usercontroller.postsighnup))

//  //login
//  router.get("/login",usercontroller.loginform)


//  router.post("/login",saveredirectpath,
//     passport.authenticate("local",
//         {failureRedirect:"/signup/login",failureFlash:true}),
        
// usercontroller.postlogin
//  )
//here in the above code is write bu here i M USEung router,route method where i can combine the requse that come to a single path
router.route("/")
.get(usercontroller.signupform)
.post(asyncwarp(usercontroller.postsighnup))

router.route("/login")
.get(usercontroller.loginform)
.post(saveredirectpath,
   passport.authenticate("local",
         {failureRedirect:"/signup/login",failureFlash:true}),
        
 usercontroller.postlogin)
 

//  logout path

router.get("/logout",usercontroller.logout)

 module.exports=router;