/**
 * Created by toned_000 on 8/17/2017.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../../models/User');

var jwt = require('jsonwebtoken');
//TODO: hide secret in different file
const JWT_SECRET = 'J5bn&vwMW1%vRP1x';



router.get('/login', function(req, res){
    res.json({register: 'login working correctly'})
});

router.get('/register', function(req, res){
    res.json({register: 'register working correctly'})
});
// Register User
router.post('/register', function(req, res){
    //this gets all the fields from the register request and runs 
    //validation on them
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.password2;

    // Validation using body parser to check html fields posted
    // first param is var second is error message
    req.checkBody('firstName', 'First name is required').notEmpty();
    req.checkBody('lastName', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
        // TODO: connect correct errors to react layout
        res.send(errors)
        }
    else {
        //Creates new user
        var newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email:email,
            username: username,
            password: password
        });
        //passes newUser to the createUser function which generates a hashed salted pwrd
        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });
        //success message
        res.json({
            success_msg: 'You are registered and can now login',
            admin: newUser
    })
        
      
    }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return res.json({error: "No user by that name"});
                 
            }else{

            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                   const token = jwt.sign({
                       id: user.entityKey.id,
                       username: user.entityData.username
                   },JWT_SECRET)
                   user.token  = token;
                    console.log(user.token);
                    console.log("above is the user below is the error");
                    return done(null, user);
                    
                } else {
                    console.log("Invallid Password");
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        }});
    }));

// Writing user section
passport.serializeUser(function(user, done) {
    console.log("Log in worked")
    return done(null, user.entityKey.id);
});
// reading from user session
passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        console.log("deserialized is being ran");
        done(err, user);
    });
});
process.on('unhandledRejection', error => {
    // Prints "unhandledRejection woops!"
    console.log("Handling rejected promise in a shitty way for now");
  });
// login function 
//TODO: Fix unhandled promise fro when a user logs in but user exist in database
router.post('/login',
passport.authenticate('local'),

function(req, res) {
    req.session.user = req.user;
    res.json(req.session.user);
});
// Logout Function
router.get('/logout', function(req, res){
    req.logout();

    res.json({logout_msg: 'You are logged out'});

   
});

module.exports = router;
