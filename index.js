const express=require("express");
const mongoose=require("mongoose");
const port=3000;
const app=express();
const mongourl="mongodb://127.0.0.1:27017/wonderla";
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
//staticpublic file
app.use(express.static(path.join(__dirname,"public")))
//asyncwarp
const asyncwarp=require("./utils/asyncwarp.js")
//costomerror
const costomerror=require("./utils/costomerror/costom.js")
//joischena\

const {schema}=require("./joi.js");

//review schema
const review=require("./models/review.js");


//ejsmate
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
//postdata

app.use(express.urlencoded({extended:true}))
//db part
const Listing=require('./models/listings.js')
//method override
const methodOverride = require('method-override');

app.use(methodOverride('_method'));                // For PUT and DELETE methods

 
// override with the X-HTTP-Method-Override header in the request
//reviewjoi schema
const {reviewschema}=require("./joi.js");




main().then(()=>{
    console.log("database connected");
})
async function main(){
    await mongoose.connect(mongourl)
}

app.listen(port,()=>{
    console.log(`app is running on port${port}`)
})
app.get("/",(req,res)=>{
    // console.log("hello world");
    res.send("i am in home page")
})
// app.get('/listings',async(req,res)=>{
//     const Samplelistings=new Listing({
//         title:"jay bajrang bali",
//         description:"my protector",
//         image:"",
//         price:60000,
//         location:"bbsr",
//         country:"india"

//     })
//     await Samplelistings.save();
//     console.log("collection is created")

// })
//joivalidation useing middlewire
const joiValidation=(req,res,next)=>{
    console.log('Validating body:', req.body); // Add this

    const {error}=schema.validate(req.body);
    if(error){
         console.log(error)
        throw new costomerror(400,error)
    }
    next()
}
//for reviewvalidationusing middlewire
const reviewValidation=(req,res,next)=>{
    const {error}=reviewschema.validate(req.body);
    if(error){
        console.log(error)
        throw new costomerror(400,error)
    }
    next()
}
//home route

//each single list detail route
app.get("/listing/:id",asyncwarp(async(req,res)=>{
    let {id}=req.params;
    // console.log(id)
    let single=await Listing.findById(id).populate("reviews")
     console.log(single)
    res.render("listings/single.ejs",{single})
   

}))

app.get("/listings",asyncwarp(async(req,res)=>{
    let alllist=await Listing.find({})
    // console.log(alllist)
    // console.log(alllist)
    res.render("listings/index.ejs",{alllist})
}))

//new list route
app.get("/new",(req,res)=>{
    res.render("listings/form.ejs")
    

})
app.post("/add",
    joiValidation,
    asyncwarp(async(req,res,next)=>{
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
   
    let newsamp=new Listing({
        title:title,
        description:description,
        price:price,
        location:location,
        country:country,
        image:image,
    })
    
  await newsamp.save().then(()=>{
    console.log("new person is added")
  })

// await Listing.insertOne(req.body).then((res)=>{
//     console.log(res)
// })
res.redirect("/listings")
   

}))
//edit route



app.get("/edit/:id",asyncwarp(async(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    let Post=await Listing.findById(id);
    // console.log(Post);
    res.render("listings/edit.ejs",{Post})
}));

app.put("/edit/it/:id",joiValidation,asyncwarp(async(req,res)=>{
    let {id}=req.params;
    
    // console.log(id)
    // if(!req.body.title || !req.body.description || !req.body.price || !req.body.location || !req.body.country || !req.body.image){
    //     throw new costomerror(400,"please provide all the fields")
    // }
    console.log(req.body)
    await Listing.findByIdAndUpdate(id,req.body)
    // let{image}=req.body;
    // console.log(image)
    console.log(req.body);
    res.redirect(`/listings`);
}))
//delete route
app.delete("/delete/:id",asyncwarp(async(req,res)=>{
    let {id}=req.params;
    // console.log(id)
    await Listing.findByIdAndDelete(id).then((res)=>{
        console.log(res);
    })
res.redirect("/listings")
}))

//review route
app.post("/listings/:id/reviews",
    reviewValidation,
   asyncwarp( async(req,res)=>{
    console.log(req.body)
    // let review1=new review(req.body)
    // let val1=await review1.save();
    // console.log(val1)
    let review2=new review(req.body.review || req.body)
    // console.log(review2)
     let val2=await review2.save()
     console.log(val2)
    let {id}=req.params;
     console.log(id)
    let listings=await Listing.findById(id);
    listings.reviews.push(val2)
    let val3=await listings.save();
    console.log(val3)
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
    res.redirect(`/listing/${id}`)
}))
// review delete route
app.delete("/listings/:singleid/reviews/:rvwid",
    asyncwarp(async(req,res)=>{
 let{singleid,rvwid}=req.params;
 console.log(singleid,rvwid);
 await Listing.findByIdAndUpdate(singleid,{$pull:{reviews:rvwid}})
 await review.findByIdAndDelete(rvwid).then((res)=>{
    console.log(res)
 })
 res.redirect(`/listing/${singleid}`);
    
}


))

//if path not define

app.all("*",(req,res,next)=>{
    next(new costomerror(404,"page not found"))
    // throw new costomerror(404,"page not found vai")
    // res.render("listings/error.ejs",{err})
})
// // error handling middlewire
// app.use((err,req,res,next)=>{

//     let{status=500,message}=err;
//     // res.status(status).send(message)
//     // res.send("something went wrong")
//     // console.log(err.message)
//     // console.log(err)
//     next(err);
//     res.render("listings/error.ejs",{err})
    

// })
//error handling middlewire
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;

    if (req.headers.accept && req.headers.accept.includes("application/json")) {
        // If request expects JSON (like Postman or frontend fetch)
        return res.status(status).json({ error: message });
    } else {
        // Otherwise render an HTML error page for the browser
        res.status(status).render("listings/error.ejs", { err });
    }
});



