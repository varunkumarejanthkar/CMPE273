//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var service = require('./Services/Service');
var userModel = require('./Model/UserModel');
const multer = require('multer');
const {check,validationResult} = require("express-validator");
const upload = multer();
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
    
    var password = req.body.password;
    var email = req.body.mail;
    //console.log("Inside Signup Post Request : " + username);
    //console.log("Req Body : ", username + "password : ",password);
    var model = new userModel.UserModel(null, password, email);
    //var returnValue = service.signupService(modal);
    //console.log("Inside Signup : " + returnValue);
    service.loginService(model)    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
        //req.session.user = user;
        console.log("Inside app post login : " + results);
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log(results[0]);
        res.end(JSON.stringify(results[0]));
    })
    .catch(function(err){
        console.log("Inside app post login - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });
});


app.post('/Signup',function(req,res){    
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.emailAddress;
    console.log("Inside Signup Post Request : " + username);
    //console.log("Req Body : ", username + "password : ",password);
    var modal = new userModel.UserModel(username, password, email);
    //var returnValue = service.signupService(modal);
    //console.log("Inside Signup : " + returnValue);
    service.signupService(modal)
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
        //req.session.user = user;
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        res.end();
    })
    .catch(function(err){
        console.log("Promise rejection error: "+err);
        return res.status(500).send({
            message: 'Signup Error'
         });
    })    
});

app.post('/account',function(req,res){    
    var password = req.body.Password;
    var mail = req.body.Mail;    
    var model = new userModel.UserModel(req.body.UserName, password, mail, req.body.UserId, req.body.Phone_Number, "", req.body.DefaultCurrency, req.body.Language);
    //var returnValue = service.signupService(modal);
    //console.log("Inside Signup : " + returnValue);
    service.updateUserDetails(model)    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
        //req.session.user = user;
        console.log("Inside app post account : " + results);
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        res.end();
    })
    .catch(function(err){
        console.log("Inside app post account - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });
});

app.get('/createNewGroup', function(req,res){
    console.log("Inside app.get createNewGroup");    
    service.getAllUserDetails()    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside app.get createNewGroup then block");
        console.log(JSON.stringify(results));
        res.end(JSON.stringify(results));
    })
    .catch(function(err){
        console.log("Inside app post account - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });     
})


app.post('/createNewGroup',function(req,res){    
    const userId = req.body.UserId;
    const groupName = req.body.Groupname;
    const userNameArray = req.body.UserNameArray;
    const emailArray = req.body.emailArray;    
    const userIdArray = req.body.UserIdArray;
    
    try{
        service.createGroup(userId, groupName, userNameArray, emailArray, userIdArray);
        
            console.log("Inside index.js app.post createNewGroup if");
            res.writeHead(200,{
                     'Content-Type' : 'text/plain'
                 });       
            res.end();  
    }
    catch(err){
            console.log("Inside index.js app.post createNewGroup catch block" + err);
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            });  
            return res.end();
    }                  
});

app.post('/saveExpense',function(req,res){    
    const expense = req.body.Expense;
    const groupName = req.body.GroupName;
    const expenseDescription = req.body.ExpenseDescription; 
    const userName = req.body.UserName;   
    const groupId = req.body.GroupID;
    const userId =req.body.UserId;
    service.saveExpense(expense, groupName, expenseDescription, userName, groupId, userId)    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside app.get saveExpense then block");
        //console.log(JSON.stringify(results));
        res.end();
    })
    .catch(function(err){
        console.log("Inside app post saveExpense - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });                  
});

app.post('/IsGroupCreated',function(req,res){    
    var groupName = req.body.GroupName; 

    service.IsGroupCreated(groupName)    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
        //req.session.user = user;
        console.log("Inside app post IsGroupCreated : " + results);
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside app post IsGroupCreated - Success");
        res.end();
    })
    .catch(function(err){
        console.log("Inside app post IsGroupCreated - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });
});

app.post('/saveInvitation',function(req,res){    
    const userId = req.body.userId;
    const groupId = req.body.groupId;

    service.saveInvitation(userId, groupId)    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});       
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside app post saveInvitation - Success");
        res.end();
    })
    .catch(function(err){
        console.log("Inside app post saveInvitation - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });
});

app.post('/settleUpExpenses',function(req,res){    
    const userId = req.body.UserId;
    const userName2 = req.body.UserName;
    const userId2 = req.body.UserId2;

    service.settleUpExpenses(userId, userName2, userId2)    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});       
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside app post settleUpExpenses - Success");
        res.end();
    })
    .catch(function(err){
        console.log("Inside app post settleUpExpenses - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });
});

app.post('/leaveGroup',function(req,res){    
    const groupId = req.body.GroupId;    
    const userId = req.body.UserId;

    service.leaveGroup(userId, groupId)    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
        //req.session.user = user;
        //console.log("Inside app post leaveGroup : " + results);
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside app post leaveGroup - Success");
        res.end();
    })
    .catch(function(err){
        console.log("Inside app post leaveGroup - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });
});

app.post('/saveFile', upload.single('file_uplaoded'), function(req, res, next) {
    // req.file is the `file_uplaoded` file 
    // req.body will hold the text fields, if there were any 
    const fileBytes = req.file;    
    const userId = req.body.UserId;

    service.saveFile(fileBytes, userId)    
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});      
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        console.log("Inside app post saveFile - Success");
        res.end();
    })
    .catch(function(err){
        console.log("Inside app post saveFile - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });
  })

app.get('/GetAllGroupsDetails', function(req,res){
    console.log("Inside app.get GetAllGroupsDetails : UserId : " + req.query.UserId);       
    service.getAllGroupDetails(req.query.UserId)  
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
        //req.session.user = user;
        //console.log("Inside app post login : " + results);
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })

        console.log("Inside app.get GetAllGroupsDetails then block");        
        res.end(JSON.stringify(results));
    })
    .catch(function(err){
        console.log("Inside app get GetAllGroupsDetails - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });     
})

app.get('/GetGroupInvitationDetails', function(req,res){
    console.log("Inside app.get GetGroupInvitationDetails : UserId : " + req.query.UserId);       
    service.GetGroupInvitationDetails(req.query.UserId)  
    .then(function(results){
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
        //req.session.user = user;
        //console.log("Inside app post login : " + results);
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })

        console.log("Inside app.get GetGroupInvitationDetails then block");        
        res.end(JSON.stringify(results));
    })
    .catch(function(err){
        console.log("Inside app get GetGroupInvitationDetails - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });     
})

app.get('/GetAllExpensesDetails', function(req,res){
    console.log("Inside app.get GetAllExpensesDetails");    
    console.log(req.query.userId);   
    service.getAllExpensesDetails(req.query.userId)  
    .then(function(results){      
        res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});        
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })

        console.log("Inside app.get GetAllExpensesDetails then block");
        console.log(JSON.stringify(results));
        res.end(JSON.stringify(results));
    })
    .catch(function(err){
        console.log("Inside app get GetAllExpensesDetails - Promise rejection error: "+err);
        return res.status(500).send({
            message: err
         });
    });     
})
//Route to get All Books when user visits the Home Page
app.get('/Signup', function(req,res){
    console.log("Inside app.get Signup");    
    res.writeHead(200,{
        'Content-Type' : 'application/json'
    });
    console.log("Books : ",JSON.stringify(books));
    res.end(JSON.stringify(books));    
})

app.get('/account', function(req,res){
    console.log("Inside app.get account");    
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


//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");