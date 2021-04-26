const mysql = require("mysql");
const UserModel = require("../Model/UserModel");

const createConnection = () => {
  const con = mysql.createConnection({
    host: "splitwisedatabase.cwgv9f0vak1r.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "Splitwise12345",
  });

//   const con = mysql.createConnection({
//     host: "localhost",
//     //port:"3306",
//     user: "root",
//     password: "password",
//     insecureAuth : true
// //    database: 'LocalDB'
//   });
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });
  return con;
};

const saveSignUpDetails = function (userModel) {
  const con = createConnection();
  const records = [    
      userModel.username,
      userModel.password,
      userModel.email,
      "Dollar",
      "English",
      require("moment")().format("YYYY-MM-DD HH:mm:ss")    
  ];

  return new Promise(function (resolve, reject) {
    con.query(
      "call `dbo.splitwise`.sp_splitwise_InsertUserDetails(?,?,?,?,?,?)",
      [records[0], records[1],  records[2],  records[3],  records[4],  records[5]],
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log();
          reject(err);
        }
        if (result) {
          console.log(result);
          if (result.length == 0) {
            console.log("Inside saveSignUpDetails : User doesn't exist");
            reject();
          } else {            
            console.log("Inside saveSignUpDetails : " + JSON.stringify(result[0][0]));            
            //con.end();
            resolve(result[0][0]);
          }
        }
      }
    );
  });
};

const saveUserDetails = function (userModel) {
  const con = createConnection();
  const records = [
    [
      userModel.username,
      userModel.password,
      userModel.email,
      userModel.phoneNumber,
      require("moment")().format("YYYY-MM-DD HH:mm:ss"),
      userModel.currency,
      userModel.language,
      userModel.userId
    ],
  ];

  return new Promise(function (resolve, reject) {
    con.query(
      "update `dbo.splitwise`.Users set UserName = ?, Password = ?, Mail = ?, Phone_Number = ?, Last_Login = ?, DefaultCurrency = ?, Language = ? where UserId = ?",
      [ userModel.username,
        userModel.password,
        userModel.email,
        userModel.phoneNumber,
        require("moment")().format("YYYY-MM-DD HH:mm:ss"),
        userModel.currency,
        userModel.language,
        userModel.userId],
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log(err);
          reject(err);
        }
        if (result) {
          //console.log(result);
          //con.end();
          resolve("Successfully Updated.");
        }
      }
    );
  });
}
const GetUserDetails = (userModel) => {
  const con = createConnection();

  return new Promise(function (resolve, reject) {
    con.query(
      "Select * from `dbo.splitwise`.Users U inner join `dbo.splitwise`.FileDetails F on U.UserId = F.UserId where Mail = ?",
      [userModel.email],
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside GetUserDetails : " + err);
          reject("User Doesn't exist : " + err);
        }
        if (result) {
          console.log(result);
          if (result.length == 0) {
            console.log("Inside GetUserDetails : User doesn't exist");
            reject("User Doesn't exist");
          } else {
            console.log("Inside GetUserDetails : " + result[0].UserId);
            //con.end();
            resolve(result);
          }
        }
      }
    );
  });
}

const getAllUserDetails = () => {

  // var pool  = mysql.createPool({
  //   connectionLimit : 500,
  //   host: "splitwisedatabase.cwgv9f0vak1r.us-east-2.rds.amazonaws.com",
  //   user: "admin",
  //   password: "Splitwise12345",
  // });
  const con = createConnection();

  return new Promise(function (resolve, reject) {
    // pool.getConnection(function(err, con){
    //   if(err){
    //       return cb(err);
    //   }
    con.query(
      "Select * from `dbo.splitwise`.Users",      
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside db.GetAllUserDetails error: " + err);
          reject(err);
        }
        if (result) {
          console.log(result);
          if (result.length == 0) {
            console.log("Inside b.GetAllUserDetails : Users doesn't exist");
            reject("Users doesn't exist");
          } else {
            console.log("Inside GetAllUserDetails : " + result[0].UserId);
            //con.end();
            resolve(result);
          }
        }
      }
    )
    // })
  });
}

const createGroup = (userId, groupName, userIdArray, emailArray) => {
  const con = createConnection();
  return new Promise(function (resolve, reject) {
    con.query(
      "Insert into `dbo.splitwise`.GroupsTable(GroupName, GroupType, CreatedDate, Groupsize) values(?,'Other', ?, ?)",
      [groupName, require("moment")().format("YYYY-MM-DD HH:mm:ss"), userIdArray.length],
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside createGroup : " + err);
          reject("GroupName already exists : " + err);
        }
        if (result) {
          console.log(result);
          if (result.length == 0) {
            console.log("GroupName already exists");
            reject("GroupName already exists");
          } else {
            console.log("Group created successfully");
            //con.end();
            resolve(result);
          }
        }
      }
    );
  });
}

const InsertUserGroupRelationships = async (userId, groupName, userNameArray, emailArray, userIdArray, groupId, recentActivity) => {
  const con = createConnection();
  console.log(userIdArray);
  const userIdArrayString = userIdArray.join();       
    let dbQuery = "call `dbo.splitwise`.sp_splitwise_InsertMappings('" + userIdArrayString + "'," + groupId + "," + userId + "," + userIdArray.length +",'" + recentActivity + "')";
     console.log(dbQuery);
     return new Promise(function (resolve, reject) { 
      con.query(
      dbQuery,  
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside db.InsertUserGroupRelationships : " + err);
          reject(err);
        }
        if (result) {
          console.log(result);
          if (result.length == 0) {
            console.log("db.InsertUserGroupRelationships : 500");
            reject();
          } else {
            console.log("db.InsertUserGroupRelationships created successfully");
            //con.end();
            resolve("InsertUserGroupRelationships created successfully");
          }
        }
      }      
    );
  });  
}

const getGroupDetails = (groupName) =>
{
  const con = createConnection();

  return new Promise(function (resolve, reject) {
    con.query(
      "Select * from `dbo.splitwise`.GroupsTable where GroupName = ?",
      [groupName],      
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside db.getGroupDetails error: " + err);
          reject(err);
        }
        if (result) {
          //console.log(result);
          if (result.length == 0) {
            console.log("Inside db.getGroupDetails : groupname doesn't exist");
            reject("Internal Server Error");
          } else {
            console.log("Inside db.getGroupDetails - groupID : " + result[0].GroupID);
            //con.end();
            resolve(result[0].GroupID);
          }
        }
      }
    );
  });
}

const IsGroupCreated = (groupName) =>
{
  const con = createConnection();

  return new Promise(function (resolve, reject) {
    con.query(
      "select * from `dbo.splitwise`.GroupsTable inner join User_Group_Mapping on GroupsTable.GroupID = User_Group_Mapping.GroupId where GroupName = ?",
      [groupName],      
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside db.IsGroupCreated error: " + err);
          reject(err);
        }
        if (result) {
          //console.log(result);
          if (result.length == 0) {
            console.log("Inside db.IsGroupCreated : groupname doesn't exist");
            reject("Internal Server Error");
          } else {
            console.log("Inside db.IsGroupCreated - groupID : " + result[0].GroupID);
            //con.end();
            resolve();
          }
        }
      }
    );
  });
}

const getAllGroupDetails = (userId) =>
{
  const con = createConnection();

  return new Promise(function (resolve, reject) {
    con.query(
      "select * from `dbo.splitwise`.GroupsTable where GroupID in (Select GroupId from `dbo.splitwise`.User_Group_Mapping UG inner join `dbo.splitwise`.Users U on UG.UserId = U.UserId where U.UserId = ?)",
      [userId],      
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside db.getAllGroupDetails error: " + err);
          reject(err);
        }
        if (result) {
          //console.log(result);
          // if (result.length == 0) {
          //   console.log("Inside db.getAllGroupDetails : UserId doesn't exist");
          //   reject(new Error("Internal Server Error"));
          // } else {
            console.log("Inside db.getAllGroupDetails - groupID : ");
            //con.end();
            resolve(result);
          //}
        }
      }
    );
  });
}

const getAllExpensesDetails = (userId) => {
  const con = createConnection();
  return new Promise(function (resolve, reject) {
    con.query(
      "select * from `dbo.splitwise`.User_Group_Mapping ugm inner join `dbo.splitwise`.UserExpenses ue on ugm.UserGroupId = ue.UserGroupId where ugm.GroupId in (select ugt.GroupID from `dbo.splitwise`.Users u inner join `dbo.splitwise`.User_Group_Mapping ugt on u.UserId = ugt.UserId where u.UserId = ?)",
      [userId],      
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside db.getAllExpensesDetails error: " + err);
          reject(err);
        }
        if (result) {
          //console.log(result);          
            console.log("Inside db.getAllExpensesDetails - result block : " + result);
            //con.end();
            resolve(result);          
        }
      }
    );
  });
}

const getUserIdArray = (groupId, userId) => {
  const con = createConnection();
  return new Promise(function (resolve, reject) {
    con.query(
      "select UserId from `dbo.splitwise`.User_Group_Mapping where GroupId = ? and UserId != ?",
      [groupId, userId],      
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside db.getUserIdArray error: " + err);
          reject(err);
        }
        if (result) {
          //console.log(result);          
            console.log("Inside db.getUserIdArray - result block : " + result);
            //con.end();
            resolve(result);          
        }
      }
    );
  });
}

const getUserGroupId = (userName, groupId) =>
{
  const con = createConnection();
  return new Promise(function (resolve, reject) {
    con.query(
      "(select UserGroupId from `dbo.splitwise`.User_Group_Mapping where GroupId = ? and UserId = (select UserId from `dbo.splitwise`.Users where UserName = ? limit 1) limit 1)",
      [groupId, userName],      
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside db.getUserGroupId error: " + err);
          reject(err);
        }
        if (result) {
          //console.log(result);          
            console.log("Inside db.getUserGroupId - result block : " + result);
            //con.end();
            resolve(result);          
        }
      }
    );
  });
}

const saveExpenseComment = (expenseComment, expenseName) =>
{
  const con = createConnection();
  return new Promise(function (resolve, reject) {
    con.query(
      "update `dbo.splitwise`.UserExpenses set ExpenseComments = ? where ExpenseDescription = ?",
      [expenseComment, expenseName],      
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside db.saveExpenseComment error: " + err);
          reject(err);
        }
        if (result) {
          //console.log(result);          
            console.log("Inside db.saveExpenseComment - result block : " + result);
            //con.end();
            resolve(result);          
        }
      }
    );
  });
}

const saveExpense = (expense, groupName, expenseDescription, userName, groupId, userId, strExpense) => {
  return new Promise(function (resolve, reject) {
    getUserIdArray(groupId, userId) 
      .then(function (results) {
        console.log(results);
        var userIdArray = [];
        for(const obj of results)
        {
          userIdArray.push(obj.UserId);
        }
        console.log(userIdArray);
        userIdArrayString = userIdArray.join();
        const len = results.length;
        expense = expense / (len + 1) ;
        console.log("Expense  : " + expense);

        getUserGroupId(userName, groupId)
        .then(function(r) {

        const con = createConnection();
        console.log("From getUserGroupId : " + r[0]);

          con.query(
            "call `dbo.splitwise`.sp_splitwise_SaveGroupExpenses(?,?,?,?,?,?,?,?,?)",
            [userName, groupId, expense,expenseDescription, userIdArrayString, len, r[0].UserGroupId, strExpense, userId],      
            function (err, result, fields) {
              con.end();
              if (err) {
                //con.end();
                console.log("Inside db.saveExpense error: " + err);
                reject(err);
              }
              if (result) {
                //console.log(result);          
                  console.log("Inside db.saveExpense - result block : " + result);
                  //con.end();
                  resolve(result);          
              }
            });
          })
          .catch(function (err) {
            console.log("Promise rejection error: " + err);
            reject(err);
          });
        })
        .catch(function (err) {
          console.log("Promise rejection error: " + err);
          reject(err);
        });  
      });
}

const GetGroupInvitationDetails = (userId) => {
  const con = createConnection();

  return new Promise(function (resolve, reject) {
    con.query(
      "select * from `dbo.splitwise`.User_Group_Mapping ugm inner join `dbo.splitwise`.GroupsTable g on ugm.GroupId = g.GroupID where ugm.UserId = ?",
      [userId],      
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside db.GetGroupInvitationDetails error: " + err);
          reject(err);
        }
        if (result) {
          //console.log(result);          
            console.log("Inside db.GetGroupInvitationDetails - result block : " + result);
            //con.end();
            resolve(result);          
        }
      }
    );
  });
}

const saveInvitation = (userId, groupId) => {
  const con = createConnection();

  return new Promise(function (resolve, reject) {
    con.query(
      "update `dbo.splitwise`.User_Group_Mapping set IsInvitationAccepted = 1 where UserId = ? and GroupId = ?",
      [userId, groupId],      
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside db.saveInvitation error: " + err);
          reject(err);
        }
        if (result) {
          //console.log(result);          
            console.log("Inside db.saveInvitation - result block : " + result);
            //con.end();
            resolve(result);          
        }
      }
    );
  });
}

const leaveGroup = (userId, groupId) => {
  const con = createConnection();

  return new Promise(function (resolve, reject) {
    con.query(
      "delete from `dbo.splitwise`.User_Group_Mapping where UserId = ? and GroupId = ?",
      [userId, groupId],      
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside db.leaveGroup error: " + err);
          reject(err);
        }
        if (result) {
          //console.log(result);          
            console.log("Inside db.leaveGroup - result block : ");
            //con.end();
            resolve();          
        }
      }
    );
  });
}

const settleUpExpenses = (userId, userName2, userId2, activity) => {
  const con = createConnection();

  return new Promise(function (resolve, reject) {
    con.query(
      "delete from `dbo.splitwise`.UserExpenses where ExpenseId in (select eid from (select ExpenseId as eid from `dbo.splitwise`.UserExpenses where (UserId2 = ? and UserGroupId  in (select UserGroupId from `dbo.splitwise`.User_Group_Mapping where UserId = ?)) or (UserId2 = ? and UserGroupId  in (select UserGroupId from `dbo.splitwise`.User_Group_Mapping where UserId = ?))) as E)",
      [userId, userId2, userId2, userId],      
      function (err, result, fields) {
        if (err) {
          //con.end();
          console.log("Inside db.settleUpExpenses error: " + err);
          reject(err);
        }
        if (result) {          
            con.query(
              "call `dbo.splitwise`.sp_splitwise_SaveExpenseActivities(?,?,?)",
              [userId, userId2, activity],      
              function (err, result, fields) {
                con.end();
                if (err) {
                  //con.end();
                  console.log("Inside db.settleUpExpenses error: " + err);
                  reject(err);
                }
                if (result) {
                  //console.log(result);          
                    console.log("Inside db.settleUpExpenses - result block : ");
                    //con.end();
                    resolve();          
                }
              }
            );               
        }
      }
    );
  });
}

const saveFile = (fileBytes, userId) => {
  const con = createConnection();

  return new Promise(function (resolve, reject) {
    con.query(
      "Update `dbo.splitwise`.FileDetails set FileBytes = ? where UserId = ?",
      [fileBytes.buffer, userId],      
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside db.saveFile error: " + err);
          reject(err);
        }
        if (result) {
          //console.log(result);          
            console.log("Inside db.saveFile - result block : ");
            //con.end();
            resolve();          
        }
      }
    );
  });
}

const getRecentActivityDetails = (userId) => {
  const con = createConnection();

  return new Promise(function (resolve, reject) {
    con.query(
      "Select activity from `dbo.splitwise`.RecentActivity where UserId = ?",
      [userId],      
      function (err, result, fields) {
        con.end();
        if (err) {
          //con.end();
          console.log("Inside db.getRecentActivityDetails error: " + err);
          reject(err);
        }
        if (result) {
          //console.log(result);          
            console.log("Inside db.getRecentActivityDetails - result block : ");
            //con.end();
            resolve(result);          
        }
      }
    );
  });
}

exports.saveSignUpDetails = saveSignUpDetails;
exports.GetUserDetails = GetUserDetails;
exports.saveUserDetails = saveUserDetails;
exports.createGroup = createGroup;
exports.InsertUserGroupRelationships = InsertUserGroupRelationships;
exports.getAllUserDetails = getAllUserDetails;
exports.getAllGroupDetails = getAllGroupDetails;
exports.IsGroupCreated = IsGroupCreated;
exports.getAllExpensesDetails = getAllExpensesDetails;
exports.getGroupDetails = getGroupDetails;
exports.saveExpense = saveExpense;
exports.GetGroupInvitationDetails = GetGroupInvitationDetails;
exports.saveInvitation = saveInvitation;
exports.leaveGroup = leaveGroup;
exports.settleUpExpenses = settleUpExpenses;
exports.saveFile = saveFile;
exports.getRecentActivityDetails = getRecentActivityDetails;
exports.saveExpenseComment = saveExpenseComment;