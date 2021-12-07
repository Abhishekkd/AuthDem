//this model will only have a username and password and both will be strings
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
//static method on our model
//for authenticating credentials
userSchema.statics.authenticate = async function(username,password){
    //find the user by its username
    //this refers to the particular model or particular schema which will be particular user(instance of our model)
    const foundUser = await this.findOne({username}); //cant use this "this.findOne" with arrow function
    
    //if found then validate and compare using bcrypt
   const isValid =  await bcrypt.compare(password,foundUser.password); //return a boolean
   //if is valid is true ,we return the found user object(entire user) otherwise false
   return isValid ? foundUser : false;

}
//to run tis function pre saving something
//mongoose middleware
userSchema.pre('save',async function(next){
    //so if only user name is changed we wont we rehashing the password
    if(!this.isModified('password')) return next(); 
    this.password = await bcrypt.hash(this.password,12);
    next();//next is going to call save() which then will save our hashed password
})

module.exports = mongoose.model('User', userSchema);