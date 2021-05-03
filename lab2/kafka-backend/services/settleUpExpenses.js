const RecentActivity = require('../models/RecentActivity');
const UserExpenses = require('../models/UserExpenses');

  let handle_request = async(msg, callback) => { 
    let response = {};
    let err = {};
    
    try {       
          const activity = userName1 + " settled up the expenses with " + userName2 + " on " + getDate();
          UserExpenses = await UserExpenses.findOne({
            UserId1 : msg.UserId,
            UserId2 : msg.UserId2
          })  

          if(UserExpenses)
          {
            var myquery = { UserId1: msg.UserId, UserId2 : msg.UserId2 };
            UserExpenses.remove(myquery, function(err, obj) {
            if (err) {callback(null, "INTERNAL_SERVER_ERROR");}
                callback(null, "Settled Up Expenses Successfully");
            });
          }
          else
          {
            UserExpenses = await UserExpenses.findOne({
                UserId2 : msg.UserId,
                UserId1 : msg.UserId2
              })  
            
              if(UserExpenses)
              {
                var myquery = { UserId2: msg.UserId, UserId1 : msg.UserId2 };
                UserExpenses.remove(myquery, function(err, obj) {
                if (err) {callback(null, "INTERNAL_SERVER_ERROR");}
                callback(null, "Settled Up Expenses Successfully");
                });
              }                
          }         
    } catch (error) {
        console.log(error);
        err.status = "INTERNAL_SERVER_ERROR";
        err.data = "INTERNAL_SERVER_ERROR";
        //console.log("Mongo INTERNAL_SERVER_ERROR");
        callback(null, "INTERNAL_SERVER_ERROR");
    }
};

exports.handle_request = handle_request;