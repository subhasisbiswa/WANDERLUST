const mongoose=require('mongoose');
const review = require('./review.js');

const Schema=mongoose.Schema;


const listingsschema= new Schema({
    title:{
        type:String,
        required:true,
        
    },
    description:String,
    image:{
        // type:String,
        // set:(v)=> v === ""? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyovyLpFUY8JNZ_o54kbMukBprYRKSQVlo8g&s": v,
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user",
    }

})


 listingsschema.post("findOneAndDelete",async function(doc){
    if(doc){
        await review.deleteMany({
            _id:{
                $in:doc.reviews,
            }
        })
    }
 })

const Listing=mongoose.model("Listing",listingsschema);
module.exports=Listing;