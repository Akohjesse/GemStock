const path = require('path');
const express = require('express');
const app = express();
const {config, engine} = require('express-edge');
const InitiateMongoServer = require('./config/db');
const index = require('./routes/index');
const user = require('./routes/user');
const port = process.env.PORT || 5000;
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const admin = require('./routes/admin')
var bodyParser = require('body-parser');

require("./config/passport")(passport);

InitiateMongoServer();

app.use(engine);
app.set('views', __dirname + '/views');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error  = req.flash('error');
  next();
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/user', user);
app.use(admin)



if (process.env.NODE_ENV = "Production" || process.env.NODE_ENV === "staging"){
    app.use(express.static('public'));
    app.use(index);
}


app.listen(port, ()=>{
    console.log('Server started on port ' + port)
})
