const express = require('express');
const app = express();
const User = require('./models/user');

//setting up ejs
app.set('view engine', 'ejs');
//__path join not done
app.set('views','views');

//our user registration  form
app.get('/register', (req,res)=>{
    res.render('register')
})


//basic route which eventually going to be secret 
app.get('/secret',(req,res)=>{
    res.send("U Are Logged In!!")
})


//to set up our server up
app.listen(3000,()=>{
    console.log("Serving Your App!!");
})