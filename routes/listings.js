const express=require("express");
const router=express.Router();
//asyncwarp
const asyncwarp=require("../utils/asyncwarp.js")
//costomerror
const costomerror=require("../utils/costomerror/costom.js")
//joischena\

const {schema}=require("../joi.js");
//db part
const Listing=require('../models/listings.js')
//method override
const methodOverride = require('method-override');
//joivalidation useing middlewire
const{islogedin,joiValidation}=require("../middlewire.js")

const{isowner}=require("../middlewire.js")
// controller start here*******
const controller=require("../controllers/listing.js");
const multer  = require('multer')

const {  storage } = require('../cloudconfig.js');
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage })









 
//each single list detail route
router.get("/listing/:id",asyncwarp(controller.show))

// **index route ***
router.get("/listings",asyncwarp(controller.index))

//new list route
router.get("/new",islogedin,controller.create)
//add the new post to the list
router.post("/add",
    islogedin,
    upload.single('image'),
    joiValidation,
    asyncwarp(controller.add))

// // *******48
// router.post("/add",upload.single('image'),(req,res)=>{
//     console.log("maa")
//     res.send(req.file)
// })




//edit route



router.get("/edit/:id",
    islogedin,
    isowner,
    asyncwarp(controller.edit));

    //update route

router.put("/edit/it/:id",
    islogedin,
    isowner,
    upload.single('image'),
    joiValidation,
    asyncwarp(controller.update))
//delete route
router.delete("/delete/:id",
    
    islogedin,
    isowner,
    asyncwarp(controller.delete))
module.exports=router;