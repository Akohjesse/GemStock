const express = require("express");
const { model } = require("mongoose");
const app = express();
const router = express.Router();
const path = require('path');
const {ensureAuthenticated} = require('../middleware/auth');
const Post =  require("../models/Post");
const {encrypt, decrypt} = require('../config/encrypt')

router.get('/', (req,res)=>{
    res.sendFile(path.resolve('./Pages/index.html'))
})

router.get('/dashboard', ensureAuthenticated, async (req,res)=>{
    var posts = await Post.find({});
    posts = posts.reverse();
     res.render('dashboard', {name : req.user.username, posts, decrypt});
    })

module.exports = router;