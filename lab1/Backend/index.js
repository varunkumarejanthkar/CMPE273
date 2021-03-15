//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const {check,validationResult} = require("express-validator");
app.set('view engine', 'ejs');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret              : 'cmpe273_kafka_passport_mongo',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

  var Users = [{
      username : "admin",
      password : "admin"
  }]

  var books = [
    {"BookID" : "1", "Title" : "Book 1", "Author" : "Author 1"},
    {"BookID" : "2", "Title" : "Book 2", "Author" : "Author 2"},
    {"BookID" : "3", "Title" : "Book 3", "Author" : "Author 3"}
]
var demo;
var bookIDArray = [1, 2, 3];
var sessionUser = "";
//Route to handle Post Request Call
app.post('/login',function(req,res){
    
    // Object.keys(req.body).forEach(function(key){
    //     req.body = JSON.parse(key);
    // });
    // var username = req.body.username;
    // var password = req.body.password;
    console.log("Inside Login Post Request");
    //console.log("Req Body : ", username + "password : ",password);
    console.log("Req Body : ",req.body);
    Users.filter(function(user){
        // if(true){
            res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.user = user;
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end("Successful Login");
        // }
        // else
        // {
            // return res.status(400).send({
                // message: 'Login Error'
             // }); 
        // }
    })    
});


app.post('/Signup',function(req,res){
    
    // Object.keys(req.body).forEach(function(key){
    //     req.body = JSON.parse(key);
    // });
    // var username = req.body.username;
    // var password = req.body.password;
    console.log("Inside Login Post Request");
    //console.log("Req Body : ", username + "password : ",password);
    console.log("Req Body : ",req.body);
    Users.filter(function(user){
        // if(true){
            res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.user = user;
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end("Successful Login");
        // }
        // else
        // {
            // return res.status(400).send({
                // message: 'Login Error'
             // }); 
        // }
    })    
});

//Route to get All Books when user visits the Home Page
app.get('/Signup', function(req,res){
    console.log("Inside app.get Signup");    
    res.writeHead(200,{
        'Content-Type' : 'application/json'
    });
    console.log("Books : ",JSON.stringify(books));
    res.end(JSON.stringify(books));    
})


//Route to get All Books when user visits the Home Page
app.get('/home', function(req,res){
    console.log("Inside Home Login");    
    res.writeHead(200,{
        'Content-Type' : 'application/json'
    });
    console.log("Books : ",JSON.stringify(books));
    res.end(JSON.stringify(books));    
})

app.post('/create', [
    check('bookId', 'Enter unique Book Id').not().isEmpty()   
  ], function (req, res) {
    if (!req.session.user) {        
        res.redirect('/');
    } else {
        //console.log("Session data : ", req.session);
        const bookId = req.body.bookId;
        const title = req.body.title;
        const author = req.body.author;                
        //console.log(books);
        const result= validationResult(req);
        var error = result.errors;

        // if(bookId == "" || bookname == "" || author == "")
        // {
        //     //console.log("fuck you if");
        //     res.render('create', {errors: error});
        // }
        // else
        if(bookIDArray.includes(Number(bookId)))
        {
            //var msg = {"error" : "Please enter unique Book Id"};
            return res.status(400).send({
                message: 'Error while creating book!'
             });         
        }
        else
        {
            books.push({ "BookID": bookId, "Title": title, "Author": author });
            bookIDArray.push(Number(bookId));
            console.log(books);
            res.end("Successful Added");
        }
        /* 
        Users.filter(function(user){
        if(user.username === req.body.username && user.password === req.body.password){
            res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.user = user;
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end("Successful Login");
        }
    })  */
    }
});

app.post('/delete', [
    check('bookId', 'Enter valid BookId').not().isEmpty()   
  ], function (req, res) {
    const bookId = Number(req.body.deleteId);
    console.log("Inside Delete : " + bookIDArray);
    console.log("Book Id : " + bookId);

    if(bookIDArray.includes(bookId))
    {
        console.log("Inside delete if");
        const index = bookIDArray.indexOf(bookId);
        console.log("before splice : " + bookIDArray);
        bookIDArray.splice(index, 1);
        console.log("after splice : " + bookIDArray);        
        books.splice(index, 1);
        console.log("\nafter splice : " + books);
        res.end("Successfully deleted");
    }
    else
    {
        console.log("Inside delete else");
        const result= validationResult(req);
        return res.status(400).send({
            message: 'Error while deleting book!'
         });    
       
        // var error = result.errors;
        // res.end('delete', {errors: error})
    }
});

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");