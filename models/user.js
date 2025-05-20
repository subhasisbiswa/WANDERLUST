const mongoose=require('mongoose');
const review = require('./review.js');
const { required } = require('joi');
const passwordlocalmongoose=require("passport-local-mongoose");

const Schema=mongoose.Schema;

const userschema=new Schema({
    email:{
        type:String,
        required:true,
    }
})

userschema.plugin(passwordlocalmongoose);

module.exports = mongoose.model('user', userschema);