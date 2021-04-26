var mysql = require("mysql");

function handle_request(msg, callback){   
    const con = createConnection();
    console.log("Inside Expense kafka backend");
    const expenseComment = msg.ExpenseComment;
    const expenseName = msg.ExpenseName;
    console.log(msg); 
    con.query(
      "update `dbo.splitwise`.UserExpenses set ExpenseComments = ? where ExpenseDescription = ?",
      [expenseComment, expenseName],      
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          //console.log("Inside db.saveExpenseComment error: " + err);
          //reject(err);
          callback(null, "Error in saving Expense Comment");
        }
        if (result) {
          //console.log(result);          
            //console.log("Inside db.saveExpenseComment - result block : " + result);
            //con.end();
            //resolve(result); 
            callback(null, "Expense Comment saved successfully!");         
        }
      }
    );

  console.log("after callback");
};

var createConnection = () => {
    var con = mysql.createConnection({
      host: "splitwisedatabase.cwgv9f0vak1r.us-east-2.rds.amazonaws.com",
      user: "admin",
      password: "Splitwise12345",
    });
  
  //   var con = mysql.createConnection({
  //     host: "localhost",
  //     //port:"3306",
  //     user: "root",
  //     password: "password",
  //     insecureAuth : true
  // //    database: 'LocalDB'
  //   });
    con.connect(function (err) {
      if (err) throw err;
      //console.log("Connected!");
    });
    return con;
  };

exports.handle_request = handle_request;