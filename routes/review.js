const express = require('express');
const router = express.Router();
//costomerror
const costomerror=require("../utils/costomerror/costom.js")
//asyncwarp
const asyncwarp=require("../utils/asyncwarp.js")

//review schema
const review=require("../models/review.js");
//reviewjoi schema
const {reviewschema}=require("../joi.js");
//db part
const Listing=require('../models/listings.js')
const {reviewValidation,islogedin,isreviewauthor}=require("../middlewire.js")
const reviewcontroller=require("../controllers/review.js")


//for reviewvalidationusing middlewire

//home route


//review route
router.post("/:id/reviews",
    islogedin,
    reviewValidation,
   asyncwarp(reviewcontroller.createreview ))

   
// review delete route
router.delete("/:singleid/reviews/:rvwid",
islogedin,
isreviewauthor,

    asyncwarp(

reviewcontroller.deletereview
))

module.exports=router;
