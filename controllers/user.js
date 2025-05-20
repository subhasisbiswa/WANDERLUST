
const user=require("../models/user.js")


module.exports.loginform=(req,res)=>{
    res.render("users/login.ejs")
 }

 module.exports.signupform=(req,res)=>{
    res.render("users/signup.ejs")
 }
 

 module.exports.postsighnup=async(req,res)=>{
     try{
         let {username,email,password}=req.body;
         const newuser=new user({username,email})
         const registeruser=await user.register(newuser,password);
         console.log(registeruser)
         req.login(registeruser,(err)=>{
             if(err){
                return next(err)
             }
             req.flash("success","welcome to woderlust")
             res.redirect("/listings")
         })
        
     }catch(e){
         req.flash("error",e.message)
         res.redirect("/signup")
     }
    
  }

  module.exports.postlogin=async(req,res)=>{
            req.flash( "success","welcome to wonderlust you logged in sucessfully");
      
            res.redirect(res.locals.redirectpath || "/listings")
        }


        module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","you successfully loged out")
        res.redirect("/listings")
    })
}