
require("dotenv").config();
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}
 console.log(process.env.CLOUD_NAME,process.env.API_KEY,process.env.API_SECRET)



const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const costomerror = require("./utils/costomerror/costom.js");

const user = require("./models/user.js"); // Assuming you have a User model

const app = express();
const port = 3000;
// const mongourl = "mongodb://127.0.0.1:27017/wonderla";
 const mongourl=process.env.ATLAS_LINK;


// Configure view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Body parser middleware (for parsing form data)
app.use(express.urlencoded({ extended: true }));

// Method Override for PUT and DELETE requests
app.use(methodOverride('_method'));

// Static files (CSS, JS, Images, etc.)
app.use(express.static(path.join(__dirname, "public")));
// mongoconnect

const store= MongoStore.create({
    mongoUrl: mongourl,
    crypto:{
secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60, // time period in seconds in which to update the session
    
})
store.on("error", (error)=>{
    console.log("session store error",error)
}
)





// Setup for Flash messages (session required)
app.use(session({
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 1000,  // 1 week expiry
        maxAge: 7 * 24 * 60 * 1000,
        httpOnly: true,
    },
}));


app.use(flash());
// Passport.js Authentication Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// Middleware to expose flash messages globally in views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentuser= req.user;
    //  console.log("currentuser=",res.locals.currentuser)
    next();
});
// Sample route to demonstrate user registration
app.get("/demouser", async (req, res) => {
    let fakeuser = new user({
        email: "aman@gmail.com",
        username: "amu"
    });

    let val = await user.register(fakeuser, "helloworld");
    console.log(val);
    res.send(val);
});



 
// EJS Mate setup for layout rendering
app.engine("ejs", ejsMate);

// Routes setup
const listrouter = require("./routes/listings.js");
const reviewrouter = require("./routes/review.js");
const userrouter=require("./routes/user.js");

app.use("/", listrouter);
app.use("/listings", reviewrouter);
app.use("/signup",userrouter)

// Database connection (Mongoose)
async function main() {
    await mongoose.connect(mongourl);
    console.log("Database connected");
}
main().catch(err => console.log(err));



// // Home route
// app.get("/", (req, res) => {
//     res.send("I am in the home page");
// });

// Catch-all route for undefined paths
app.all("*", (req, res, next) => {
    next(new costomerror(404, "Page not found"));
});

// Global error handling middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;

    // If the request expects JSON (e.g., from Postman or frontend fetch)
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
        return res.status(status).json({ error: message });
    }

    // Render an HTML error page if it's a browser request
    res.status(status).render("listings/error.ejs", { err });
});

// Start the Express server
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
