//import the require dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var service = require('./Services/Service');
var userModel = require('./Model/UserModel');
var kafka = require('./kafka/client');
const multer = require('multer');
const {check,validationResult} = require("express-validator");
const upload = multer();
const connectDB = require("./connectMongoDB");
const connectMongoDB = require('./connectMongoDB');
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
connectMongoDB();

app.post('/login',function(req,res){   
    
    kafka.make_request('Login_User',req.body, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            })
        }else{
            console.log("Inside else");
                res.json({
                    updatedList:results
                });

                res.end(JSON.stringify(results));
            }        
    });
});

app.post('/Signup',function(req,res){    
    try{
    kafka.make_request('Signup_User',req.body, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            })
        }else{
            console.log("Inside else");
                // res.json({
                //     updatedList:results
                // });

                res.end(results);
            }        
    });    
    }
    catch(e)
    {
        console.log(e);
        res.end("Internal Server Error");
    }
});


app.post('/account',function(req,res){ 

    try{
        kafka.make_request('Signup_User',req.body, function(err,results){
            console.log('in result');
            console.log(results);
            if (err){
                console.log("Inside err");
                res.json({
                    status:"error",
                    msg:"System Error, Try Again."
                })
            }else{
                console.log("Inside else");
                    // res.json({
                    //     updatedList:results
                    // });
    
                    res.end();
                }        
        });    
    }
    catch(e)
    {
        console.log(e);
        res.end("Internal Server Error");
    }

  
});

app.get('/createNewGroup', function(req,res){    
    try{
        kafka.make_request('Get_All_User_Details',req.body, function(err,results){
            console.log('in result');
            console.log(results);
            if (err){
                console.log("Inside err");
                res.json({
                    status:"error",
                    msg:"System Error, Try Again."
                })
            }else{
                console.log("Inside else");
                    // res.json({
                    //     updatedList:results
                    // });
    
                    res.end(results);
                }        
        });    
    }
    catch(e)
    {
        console.log(e);
        res.end("Internal Server Error");
    }
   
})

app.get('/getRecentActivityDetails', function(req,res){
    try{
        kafka.make_request('Get_All_User_Details',req.body, function(err,results){
            console.log('in result');
            console.log(results);
            if (err){
                console.log("Inside err");
                res.json({
                    status:"error",
                    msg:"System Error, Try Again."
                })
            }else{
                console.log("Inside else");
                    // res.json({
                    //     updatedList:results
                    // });
    
                    res.end(JSON.stringify.apply(results));
                }        
        });    
    }
    catch(e)
    {
        console.log(e);
        res.end("Internal Server Error");
    }
    
   
})


app.post('/createNewGroup',function(req,res){  
    
    try{
        kafka.make_request('Create_Group',req.body, function(err,results){
            console.log('in result');
            console.log(results);
            if (err){
                console.log("Inside err");
                res.json({
                    status:"error",
                    msg:"System Error, Try Again."
                })
            }else{
                console.log("Inside else");
                    // res.json({
                    //     updatedList:results
                    // });
    
                    res.end();
                }        
        });    
    }
    catch(e)
    {
        console.log(e);
        res.end("Internal Server Error");
    }
           
});



app.post('/saveExpenseComment',function(req,res){    
    kafka.make_request('post_saveExpenseComment',req.body, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            })
        }else{
            console.log("Inside else");
                res.json({
                    updatedList:results
                });

                res.end();
            }        
    });                
});

app.post('/saveExpense',function(req,res){ 
    kafka.make_request('post_saveExpense',req.body, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            })
        }else{
            console.log("Inside else");
                res.json({
                    updatedList:results
                });

                res.end();
            }        
    });
});

app.post('/IsGroupCreated',function(req,res){    
    try{
        kafka.make_request('Is_Group_Created',req.body, function(err,results){
            console.log('in result');
            console.log(results);
            if (err){
                console.log("Inside err");
                res.json({
                    status:"error",
                    msg:"System Error, Try Again."
                })
            }else{
                console.log("Inside else");
                    // res.json({
                    //     updatedList:results
                    // });
    
                    res.end();
                }        
        });    
    }
    catch(e)
    {
        console.log(e);
        res.end("Internal Server Error");
    }


    // var groupName = req.body.GroupName; 

    // service.IsGroupCreated(groupName)    
    // .then(function(results){
    //     res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
    //     //req.session.user = user;
    //     console.log("Inside app post IsGroupCreated : " + results);
    //     res.writeHead(200,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     console.log("Inside app post IsGroupCreated - Success");
    //     res.end();
    // })
    // .catch(function(err){
    //     console.log("Inside app post IsGroupCreated - Promise rejection error: "+err);
    //     return res.status(500).send({
    //         message: err
    //      });
    // });
});

app.post('/saveInvitation',function(req,res){   
    
    try{
        kafka.make_request('Save_Invitation',req.body, function(err,results){
            console.log('in result');
            console.log(results);
            if (err){
                console.log("Inside err");
                res.json({
                    status:"error",
                    msg:"System Error, Try Again."
                })
            }else{
                console.log("Inside else");
                    // res.json({
                    //     updatedList:results
                    // });
    
                    res.end();
                }        
        });    
    }
    catch(e)
    {
        console.log(e);
        res.end("Internal Server Error");
    }

    // const userId = req.body.userId;
    // const groupId = req.body.groupId;

    // service.saveInvitation(userId, groupId)    
    // .then(function(results){
    //     res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});       
    //     res.writeHead(200,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     console.log("Inside app post saveInvitation - Success");
    //     res.end();
    // })
    // .catch(function(err){
    //     console.log("Inside app post saveInvitation - Promise rejection error: "+err);
    //     return res.status(500).send({
    //         message: err
    //      });
    // });
});

app.post('/settleUpExpenses',function(req,res){ 
    try{
        kafka.make_request('SettleUpExpenses',req.body, function(err,results){
            console.log('in result');
            console.log(results);
            if (err){
                console.log("Inside err");
                res.json({
                    status:"error",
                    msg:"System Error, Try Again."
                })
            }else{
                console.log("Inside else");
                    // res.json({
                    //     updatedList:results
                    // });
    
                    res.end();
                }        
        });    
    }
    catch(e)
    {
        console.log(e);
        res.end("Internal Server Error");
    }

    // const userId = req.body.UserId;
    // const userName1 = req.body.UserName1;
    // const userName2 = req.body.UserName2;
    // const userId2 = req.body.UserId2;

    // service.settleUpExpenses(userId, userName1, userName2, userId2)    
    // .then(function(results){
    //     res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});       
    //     res.writeHead(200,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     console.log("Inside app post settleUpExpenses - Success");
    //     res.end();
    // })
    // .catch(function(err){
    //     console.log("Inside app post settleUpExpenses - Promise rejection error: "+err);
    //     return res.status(500).send({
    //         message: err
    //      });
    // });
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
    try{
        kafka.make_request('SaveFile',req.body, function(err,results){
            console.log('in result');
            console.log(results);
            if (err){
                console.log("Inside err");
                res.json({
                    status:"error",
                    msg:"System Error, Try Again."
                })
            }else{
                console.log("Inside else");
                    // res.json({
                    //     updatedList:results
                    // });
    
                    res.end();
                }        
        });    
    }
    catch(e)
    {
        console.log(e);
        res.end("Internal Server Error");
    }

    // req.file is the `file_uplaoded` file 
    // req.body will hold the text fields, if there were any 
    // const fileBytes = req.file;    
    // const userId = req.body.UserId;

    // service.saveFile(fileBytes, userId)    
    // .then(function(results){
    //     res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});      
    //     res.writeHead(200,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     console.log("Inside app post saveFile - Success");
    //     res.end();
    // })
    // .catch(function(err){
    //     console.log("Inside app post saveFile - Promise rejection error: "+err);
    //     return res.status(500).send({
    //         message: err
    //      });
    // });
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