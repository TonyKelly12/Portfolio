
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const formidable = require('formidable');



     //Google Data store connection
     // Authentication is automatic
     // inside Google Compute Engine.
const gstore = require('gstore-node');
const datastore = require('@google-cloud/datastore')({
                  projectId: 'react-store',
});
// Then connect gstore to the datastore
gstore.Promise = global.Promise;
gstore.connect(datastore);
const gcs = require('@google-cloud/storage');
const gce = require('@google-cloud/compute');

  


//File path to routes js files

var admin = require('./src/node-routes/users')
//Init App
var app = express();

//block header from containing information about server
app.disable('x-powered-by');

/*VIew Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars'); */

//BodyParser Middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false,
                                limit: '50mb'}));
//cookieParser middleware=-                                
app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));




//Express Session
app.use(session({
    // before dist change to var and store else where
    secret: 'kHX29Q%Pn9AUw&oa',
    saveUninitialized: false,
    //cookie: { secure: true },
    resave: false
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

//Connect Flash
app.use(flash());

//Flash error messages global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();

});
app.use(function(err,req,res,next){
    console.log(err)
});

//Whitelist of Request header options to accept.
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//creates admin route
app.use('/admin', admin)


//Test to verify server is up 
app.get('/', function (req,res) {
    res.status(200).send('hello it works!');
});

//Creating the server instance
  var server = app.listen(process.env.PORT || '9000', function(){
    console.log('App listening on port %s', server.address().port);
    console.log('Press ctrl + c to quite');
});
