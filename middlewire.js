//db part
const Listing=require('./models/listings.js')
const costomerror=require("./utils/costomerror/costom.js")
const {reviewschema}=require("./joi.js");
//review schema
const review=require("./models/review.js");
//joischena\

const {schema}=require("./joi.js");
module.exports.islogedin=(req,res,next)=>{
    // req.session.returnTo=req.originalUrl;
    // console.log(req)
    //  console.log(req.path, "..",req.originalUrl)
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
req.flash("error","you must logged in before adding")
return res.redirect("/signup/login")
    }
    next();
}

module.exports.saveredirectpath=(req,res,next)=>{
if(req.session.returnTo){
    res.locals.redirectpath=req.session.returnTo;

}
next();

}

module.exports.isowner=async(req,res,next)=>{
    const {id}=req.params;
    let Post=await Listing.findById(id)
      if(!res.locals.currentuser._id.equals(Post.owner._id)){
        req.flash("error","you are not the owner");
      return res.redirect(`/listing/${id}`)

    }
    next()
}

module.exports.joiValidation=(req,res,next)=>{
    console.log('Validating body:', req.body); // Add this

    const {error}=schema.validate(req.body);
    if(error){
         console.log(error)
        throw new costomerror(400,error)
    }
    next()
}
module.exports. reviewValidation=(req,res,next)=>{
    const {error}=reviewschema.validate(req.body);
    if(error){
        console.log(error)
        throw new costomerror(400,error)
    }
    next()
}


module.exports.isreviewauthor=async(req,res,next)=>{
     let{singleid,rvwid}=req.params;
    let Review=await review.findById(rvwid);
    console.log("review=",review)
      if(!Review.author._id.equals(res.locals.currentuser._id)){
        req.flash("error","you are not the author of this review");
      return res.redirect(`/listing/${singleid}`)

    }
    next()
}