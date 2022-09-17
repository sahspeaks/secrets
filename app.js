//jshint esversion:6
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const app=express();
const encrypt=require("mongoose-encryption");
const md5=require("md5");

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/secretDB",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});




const User=new mongoose.model("User",userSchema);


app.get("/",(req,res)=>{
    res.render("home");
});



app.get("/register",(req,res)=>{
    res.render("register");
});



app.get("/login",(req,res)=>{
    res.render("login");
});


app.post("/register",(req,res)=>{
    const newUser=new User({
        email:req.body.username,
        password:md5(req.body.password)
    });
    newUser.save((err)=>{
        if(!err){
            res.render("secrets");
        }else{
            console.log(err);
        }
    });
});

app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=md5(req.body.password);
    User.findOne({email:username},(err,foundUser)=>{
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets");
                }
            }
        }
    });
});






app.get("/logout",(req,res)=>{
    res.redirect("/");
});
app.listen(3000,()=>{
    console.log("Server started at port 3000");
});