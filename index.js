const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//connecting mongo with mongoose
// database is named farmStand where our collections will be stored and will be created for us
mongoose.connect('mongodb://localhost:27017/authDem', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> {
        console.log("Mongo connected")
    })
    .catch(err =>{
        console.log("oh fuck error");
        console.log(err);
    })

//setting up ejs
app.set('view engine', 'ejs');
//__path join not done
app.set('views','views');
//to have access to req.body after it being parsed
app.use(express.urlencoded({extended:true}));

app.get('/', (req,res)=>{
    res.send("This is the Homepage!!")
})

//our user registration  form
app.get('/register', (req,res)=>{
    res.render('register')
})
//route for submitting users data
app.post('/register',async(req,res)=>{
    //taking that username and password from req.body and creating a new user
    //but we are not going to save password instead we are gonna use bcrypt which will make us a hashed password
    //which we will store in our database
    const{password,username}= req.body;
    const hash = await bcrypt.hash(password,12);
    //storing these data in our database
    const user = new User({
        //username gonna be same but we'll be saving hashed password
        username,
        password:hash
    })
    await user.save();
    res.redirect('/');
})

//basic route which eventually going to be secret 
app.get('/secret',(req,res)=>{
    res.send("U Are Logged In!!")
})


//to set up our server up
app.listen(3000,()=>{
    console.log("Serving Your App!!");
})