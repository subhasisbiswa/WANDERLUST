


//review schema
const review=require("../models/review.js");

//db part
const Listing=require('../models/listings.js')

module.exports.createreview=async(req,res)=>{
    // console.log(req.body)
    // let review1=new review(req.body)
    // let val1=await review1.save();
    // console.log(val1)
    let review2=new review(req.body.review || req.body)
    // console.log(review2)
    review2.author=req.user._id;
     let val2=await review2.save()
    //  console.log(val2)
    let {id}=req.params;
    //  console.log(id)
    let listings=await Listing.findById(id);
    listings.reviews.push(val2)
    let val3=await listings.save();
    // console.log("val3=",val3)
    let populatedReview = await review.findById(val2._id).populate('author');
// console.log("Populated Review:", populatedReview);
    // const {id}=req.params;
    // // console.log(id)
    // const {comment,rating}=req.body;
    // // console.log(comment,rating)
    // let reviewdata=new review({
    //     comment:comment,
    //     rating:rating,
    // })
    // await reviewdata.save()
    // let listing=await Listing.findByIdAndUpdate(id,{$push:{reviews:reviewdata._id}})
    req.flash("success","review added")
    res.redirect(`/listing/${id}`)
}


module.exports.deletereview=async(req,res)=>{
 let{singleid,rvwid}=req.params;
 console.log(singleid,rvwid);
 let r1=await review.findById(rvwid).populate("author");
 console.log("r1",r1);
 await Listing.findByIdAndUpdate(singleid,{$pull:{reviews:rvwid}})
 await review.findByIdAndDelete(rvwid).then((res)=>{
    console.log(res)
 })
 req.flash("success","review is deleted")
 res.redirect(`/listing/${singleid}`);
    
}