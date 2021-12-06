//this model will only have a username and password and both will be strings
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        //2nd element is just feedback
        required:[true,'Username cannot be blank']
    },
    //this wont be the actual password it s actually the hashed password
    password:{
        type:String,
        required: [ true,'Password cannot be blank']
    }
})

module.exports = mongoose.model('User', userSchema);