const Joi = require('joi');

module.exports .schema = Joi.object({
    title: Joi.string().strict().required(),
    country: Joi.string().required(),
    location: Joi.string().required(), 
    description: Joi.string().required(),
    price: Joi.number().required(),
    image: Joi.string().allow("",null),


       

})
// module.exports = schema;


// module.exports. reviewschema= Joi.object({
//     comment: Joi.string().required(),
//     rating: Joi.number().required().min(1).max(5),

// })  


module.exports. reviewschema = Joi.object({
    review: Joi.object({
      name: Joi.string().required(),


      
      comment: Joi.string().required(),
      rating: Joi.number().required().min(1).max(5),
    })
  });
  