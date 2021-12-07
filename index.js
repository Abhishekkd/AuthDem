const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

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
app.use(session({secret: ' useABetterSecret'}))

app.get('/', (req,res)=>{
    res.send("This is the Homepage!!")
})

//our user registration/sign up form
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
    //after successfully logging in we'll add your user_id to session
    await user.save();
    res.redirect('/');
})

//get login form
app.get('/login',(req,res)=>{
    res.render('login')
})
//submitting login data
app.post('/login',async(req,res)=>{
    const {username,password} = req.body;
    //we'll find the user with this username as we dont have any id and thats why username should always be unique
   const user = await User.findOne({username}) ;// it means where ({username:username})
    //after finding what we wanna do is compare the password that we have in the req.body to the hashed password on this user
    const validPassword = await bcrypt.compare(password,user.password);
    if(validPassword){
        req.session.user_id = user._id;
        res.redirect('/secret')
    } else{
        res.redirect('/login')
    }
})

//basic route which eventually going to be secret 
app.get('/secret',(req,res)=>{
    if(!req.session.user_id){
        res.redirect('/login');
    }
    res.send("This is a secret u can only access!!")
})


//to set up our server up
app.listen(3000,()=>{
    console.log("Serving Your App!!");
})