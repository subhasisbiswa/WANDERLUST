
const mongoose=require('mongoose');

const Schema=mongoose.Schema;


const reviews= new Schema({
   comment:String,
    rating:{
         type:Number,
         min:1,
         max:5,
    },
    name:{
        type:String,
        required:true
    },
    createdat:{
        type:Date,
        default:Date.now
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"user"
    }

})

// const Listing=mongoose.model("Listing",listingsschema);
// module.exports=Listing;



module.exports=mongoose.model("Review",reviews);