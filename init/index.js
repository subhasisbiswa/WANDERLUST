const mongoose=require('mongoose');
const initdata=require('./data.js');
const Listing=require('../models/listings.js')
const mongourl="mongodb://127.0.0.1:27017/wonderla"


main().then(()=>{
    console.log("database connected");
})
.catch((err)=>{
    console.log(err)
})


async function main(){
    await mongoose.connect(mongourl)
}

const initdb = async()=>{
    await Listing.deleteMany({})
initdata.data=initdata.data.map((list)=>(
    {
        ...list,
        owner:"6818e11afebb3104e87317a0",
    }
));
// console.log(initdata.data)
    // await Listing.insertMany([
    //     {
    //         title:"aman",
    //         description:"checkout",
    //         inage:"",
    //         price:20000,
    //         location:"kedp",
    //         country:"south asia",
    //     },
    //     {
    //         title:"aman",
    //         description:"checkout",
    //         inage:"",
    //         price:20000,
    //         location:"kedp",
    //         country:"south asia",
    //     }
        
    // ])
await Listing.insertMany(initdata.data)
// await Listing.insertOne({
//     title:"aman",
//     description:"checkout",
//     inage:"",
//     price:20000,
//     location:"kedp",
//     country:"south asia",
// })
console.log("db data store");

}
initdb();
