//db part

const express=require("express");
const router=express.Router();

//costomerror
const costomerror=require("../utils/costomerror/costom.js")
//joischena\

const {schema}=require("../joi.js");
//db part
const Listing=require('../models/listings.js')
//method override
const methodOverride = require('method-override');

//all route is describe here



















// show all post
module.exports.index=async(req,res)=>{
    let alllist=await Listing.find({})
    // console.log(alllist)
    // console.log(alllist)
    res.render("listings/index.ejs",{alllist})
}
//show single listing

module.exports.show=async(req,res)=>{
    let {id}=req.params;
    // console.log(id)
    let single=await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author"
        }
    })
    .populate("owner");
   
    if(!single){
        req.flash("error","post not found")
        res.redirect("/listings")
    }
      console.log("single=",single)
    res.render("listings/single.ejs",{single})
   

}

module.exports.create=(req,res)=>{
    
    res.render("listings/form.ejs")
    

}

module.exports.add=async(req,res,next)=>{
console.log(req.body)
    let {title,description,price,location,country,image}=req.body;
    
    // if(!req.body.title || !req.body.description || !req.body.price || !req.body.location || !req.body.country || !req.body.image){
    //     console.log("please provide all the fields")
    //     throw new costomerror(400,"please provide all the fields")
    //     console.log("please provide all the fields")
    // }cl
    // if(!location){
    //     throw new costomerror(400,"please provide all the fields")
    // }
    // const result=schema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     // console.log(result.error.details[0].message)
    //     throw new costomerror(400,result.error)  
    // }
let path=req.file.path;
let filename=req.file.filename;
console.log("path=",path)
console.log("filename=",filename);
    
   
    let newsamp=new Listing({
        title:title,
        description:description,
        price:price,
        location:location,
        country:country,
        image:image,
    })
    newsamp.owner=req.user._id;
    // console.log("owner=",newsamp)
    newsamp.image={
        url:path,
        filename:filename,
    }
    
  await newsamp.save().then(()=>{
    console.log("new person is added")
  })
req.flash("success","a new listing is added")
// await Listing.insertOne(req.body).then((res)=>{
//     console.log(res)
// })
res.redirect("/listings")
   

}

module.exports.edit=async(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    let Post=await Listing.findById(id);
    // console.log(Post);
    if(!Post){
        req.flash("error","post not found")
       return res.redirect("/listing")
    }
    // console.log(Post);
    let originalurl= Post.image.url;
    console.log(originalurl);
    originalurl=originalurl.replace("/upload","/upload/h_300,w_300")
  
    res.render("listings/edit.ejs",{Post,originalurl})
}



 module.exports.update=async(req,res)=>{
    let {id}=req.params;

 const listing=  await Listing.findByIdAndUpdate(id,{...req.body})

if(typeof req.file !=="undefined"){
let url=req.file.path;
let filename=req.file.filename;
    listing.image={
       url,filename
    }
}

await listing.save();

//     // let{image}=req.body;
//     // console.log(image)
//     // console.log(req.body);
    
    req.flash("success"," listing is edited")
    res.redirect(`/listings`);
 }

// update by chatgpt
// module.exports.update = async (req, res) => {
//     const { id } = req.params;

//     // Build the update data
//     const updatedData = { ...req.body };
// let url=req.file.path;
// let filename=req.file.filename;
//     // If a file was uploaded, add image details
//     if (req.file) {
//         updatedData.image = {
//             url: req.file.path,
//             filename: req.file.filename
//         };
//     }

//     await Listing.findByIdAndUpdate(id, updatedData, {
//         new: true,
//         runValidators: true
//     });

//     req.flash("success", "Listing is edited");
//     res.redirect(`/listings`);
// };















module.exports.delete=async(req,res)=>{
    let {id}=req.params;
    // console.log(id)
    await Listing.findByIdAndDelete(id).then((res)=>{
        console.log(res);
    })
    req.flash("success","listing is deleted")
res.redirect("/listings")
}
  