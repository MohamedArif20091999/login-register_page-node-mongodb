const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt= require('bcryptjs')
const alert = require('alert');

const app = express();

app.set('view engine', 'ejs');

var salt= bcrypt.genSaltSync(10);


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true
});

// const dataBase=[];

const loginItemSchema={
    mail: String,
    password: String
}

const registerItemSchema = {
    uName: String,
    mail: String,
    password: String
}

const oldUser=mongoose.model("oldUser",loginItemSchema)
const User = mongoose.model("User", registerItemSchema)



const defaultItems = [];
// console.log(defaultItems);

// const defaultItems=[];


app.get("/", function (req, res) {
    res.render('index');
})

app.get("/register", (req, res) => {
    res.render('register')
})

app.post('/index',function(req,res){
    console.log("reached login post section.");
    const userDetail = new User({
        mail: req.body.mail,
        password: bcrypt.hashSync(req.body.password,salt) 
    });
    
    User.findOne({mail: userDetail.mail}, function(err,foundmail){
        if(!err){
            if(foundmail){
                console.log("login mail exists");
                // console.log(mail.password);
                
                if(foundmail.password === userDetail.password){
                    alert("login successful.");
                    
                }else{
                    console.log("Mail/Password is wrong.");
                    // console.log(userDetail.password);
                    
                    alert('login failed,')
                    
                }
            }
            else{
                alert("mail not registered.");
                userDetail.save();
            }
        }else{
            console.log(err);
            
        }
    })
    
})

app.post('/register', function (req, res) {
 // console.log("reached post......");   
    const userDetail = new User({
        uName: req.body.userName,
        mail: req.body.mail,
        password: bcrypt.hashSync(req.body.password, salt)
    });

    // defaultItems.push(userDetail);
    // console.log(defaultItems);
    // console.log(userDetail.mail);
    var hash=bcrypt.hashSync(userDetail.password,salt);
    console.log(hash);
    
    
    User.findOne({mail: userDetail.mail}, function(err,foundMail){
       
        if(!err){
            if(foundMail){
                console.log(foundMail);
                
                console.log("reached old user.");
                alert("Mail already exist!!");
             }else{
                console.log("reached new user!");
                alert("Registered successfully.")
                userDetail.save();
             }
        }else{
            console.log("error here!!!");
       }
       
    })

    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server started sir.");

});