const path = require('path');
const express = require('express');
const app = express();
const router = express.Router();
const Post = require('../models/Post')
const {encrypt, decrypt} = require('../config/encrypt')


router.get('/auth/admin/expertsignals', (req,res)=>{
    res.render('admin_login');
})

router.post('/auth/admin/expertsignals',async (req,res)=>{
    var posts = await Post.find({});
    posts = posts.reverse();
    if(!req.body.password === 'Beans'){
        res.send('Go back idiot')
    }
    else{
        res.render('admin', {posts, decrypt})
    }
})

router.post('/signals/create', (req,res)=>{
    const{name , signals} = req.body;
    let errors = [];
    if(!signals || !name){
    errors.push({Msg: "Make sure both input fields are filled"});
    }
    else{
      var signal_enc = encrypt(signals);
       Post.findOne({signals : signal_enc}, (err,data)=>{
         if(err) {
           console.log(err)
         } 
         if(data){
          errors.push({msg: "User Already Exists"})
          }
          else{
             const crypto_signal = new Post({
                name : name,
                signal: signal_enc
             })
             crypto_signal.save((err)=>{
               if(err){
                  err.push({msg: "Error in saving" });
               }
               else{
               res.redirect('/auth/admin/expertsignals')
               }
             })
             
          }
       })
 
 
    }
 })

 router.get('/signals/delete/:id', (req,res)=>{
      const id = req.params.id;
     Post.findByIdAndDelete({_id: id} , (err, docs)=>{
         if(err){
             throw err;
         }
         else{
             res.redirect('/auth/admin/expertsignals')
         }

     })
 })

module.exports = router;