var mysql = require("mysql");

function handle_request(msg, callback){   
    console.log("Inside Expense kafka backend");
    var expense = msg.Expense;
    var groupName = msg.GroupName;
    var expenseDescription = msg.ExpenseDescription; 
    var userName = msg.UserName;   
    var groupId = msg.GroupID;
    var userId = msg.UserId;
    var strExpense  = userName + " added the expense " + expenseDescription + " in the group " + groupName + " on " + getDate();

    console.log(msg);   
        getUserIdArray(groupId, userId) 
          .then(function (results) {
            //console.log(results);
            var userIdArray = [];
            for(var obj of results)
            {
              userIdArray.push(obj.UserId);
            }
            //console.log(userIdArray);
            userIdArrayString = userIdArray.join();
            var len = results.length;
            expense = expense / (len + 1) ;
            //console.log("Expense  : " + expense);
    
            getUserGroupId(userName, groupId)
            .then(function(r) {
    
            var con = createConnection();
            //console.log("From getUserGroupId : " + r[0]);
    
              con.query(
                "call `dbo.splitwise`.sp_splitwise_SaveGroupExpenses(?,?,?,?,?,?,?,?,?)",
                [userName, groupId, expense,expenseDescription, userIdArrayString, len, r[0].UserGroupId, strExpense, userId],      
                function (err, result, fields) {
                  con.end();
                  if (err) {
                    //con.end();
                    //console.log("Inside db.saveExpense error: " + err);   
                    callback(null, "Error in saving Expense");                       
                  }
                  if (result) {
                    //console.log(result);          
                      //console.log("Inside db.saveExpense - result block : " + result);
                      //con.end();
                      //resolve(result);  
                      callback(null, "Expense saved successfully!");        
                  }
                });
              })
              .catch(function (err) {
                //console.log("Promise rejection error: " + err);
                callback(null, "Error in saving Expense");                       
                });
            })
            .catch(function (err) {
              //console.log("Promise rejection error: " + err);
              callback(null, "Error in saving Expense");
            });  

    
    console.log("after callback");
};

var getUserGroupId = (userName, groupId) =>
{
  var con = createConnection();
  return new Promise(function (resolve, reject) {
    con.query(
      "(select UserGroupId from `dbo.splitwise`.User_Group_Mapping where GroupId = ? and UserId = (select UserId from `dbo.splitwise`.Users where UserName = ? limit 1) limit 1)",
      [groupId, userName],      
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          //console.log("Inside db.getUserGroupId error: " + err);
          reject(err);
        }
        if (result) {
          //console.log(result);          
            //console.log("Inside db.getUserGroupId - result block : " + result);
            //con.end();
            resolve(result);          
        }
      }
    );
  });
}

var getDate = () => {
    var d = new Date();
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    return today;
  }
  
var getUserIdArray = (groupId, userId) => {
    var con = createConnection();
    return new Promise(function (resolve, reject) {
      con.query(
        "select UserId from `dbo.splitwise`.User_Group_Mapping where GroupId = ? and UserId != ?",
        [groupId, userId],      
        function (err, result, fields) {
          con.end();
          if (err) {
            //con.end();
            //console.log("Inside db.getUserIdArray error: " + err);
            reject(err);
          }
          if (result) {
            //console.log(result);          
              //console.log("Inside db.getUserIdArray - result block : " + result);
              //con.end();
              resolve(result);          
          }
        }
      );
    });
  }

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
