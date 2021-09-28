const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {encrypt, decrypt} = require('../config/encrypt');
const { check, validationResult} = require("express-validator");
const Post =  require("../models/Post");

require("../config/passport")(passport)

router.get('/signUp', (req, res)=> {
    res.render('signup',{
        typeOfForm: 'Sign Up'
    });
})

router.get('/login' , (req, res)=>{
    res.render('login', {
        typeOfForm: 'Login'
        
    })
})

router.post('/signup', [ check("email", "Please enter a valid username").isEmail()],  (req, res)=>{
     const {username,email, password} = req.body;
    let errors = []  
  
    const result = validationResult(req);
    if(!result.isEmpty()){
        let error = result.array();
        errors.push({msg: error[0].msg})
    }
   if(password.length < 6){
     errors.push({msg: 'Password must be atleast 6 characters'})
   }
   if(password.length > 23){
    errors.push({msg: 'Password must not be more than 30 characters'})
  }  
  if(errors.length > 0 ) {

        res.render('signup', {
                errors : errors,
                name : username,
                email : email,
                password : password,
       
         })
    }
    else{
       
    User.findOne({email : email}).exec((err,user)=>{ 
        if(user) {
           res.render('signup', {
               errors:{
                   msg: 'User already exists, Login instead'
               }    
           })
           
        } 
        else {
            const user = new User({
                username : username,
                email : email,
                password : password
            });
            
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(user.password, salt, (err,hash)=>{
                    if(err) throw err;
                    user.password = hash;
                  user.save(async (err)=>{
                        if(err) throw err;
                        
                        else  var posts = await Post.find({}); posts = posts.reverse(); res.render('dashboard', {
                            name: user.username,
                            decrypt,
                            from: 'Welcome To Expert Signals',
                            posts
                        })
                    })
                    
                })
            })
        }
    })
    }

});

router.post('/login',  (req,res,next)=> { passport.authenticate('local',
    {
        successRedirect : '/dashboard',
        failureRedirect: '/user/login',
        failureFlash : true
    })
    (req,res,next)
})

router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.sendFile(path.resolve('./Pages/index.html'))
})

module.exports = router;