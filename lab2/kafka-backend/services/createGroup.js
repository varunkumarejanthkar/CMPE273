const Groups = require('../models/Groups');
const Users = require('../models/Users');
const RecentActivity = require('../models/RecentActivity');

const createGroupRecentActivity = (userId, groupName, userNameArray, userIdArray) => {
    var count = 0;
    var str = "";
  
    for(const obj of userIdArray)
    {
      if(obj === userId)
      {
        str += userNameArray[count];
        break;
      }
  
      count++;
    }
  
    str += " created the group " + groupName + " on " + getDate();
    return str;
}
  
  let handle_request = async(msg, callback) => { 
    let response = {};
    let err = {};
    try {       
            const recentActivity = createGroupRecentActivity(msg.UserId, msg.Groupname, msg.UserNameArray, msg.UserIdArray);
            let group = new Groups({
                GroupName: msg.Groupname,
                GroupType: 'Other',
                GroupSize: msg.UserIdArray.length,
                Users: msg.UserIdArray,
                CreatedDate: require("moment")().format("YYYY-MM-DD HH:mm:ss")                
            });
            const groupsave = await group.save();
            if (groupsave) {                
                user.GroupId = groupsave._id;                

                for(const obj of msg.UserIdArray)
                {
                    let user = await Users.findOne({
                        _id: obj
                    });       

                    if(user)
                    {
                        user.Groups.push(GroupId);
                        user.save();
                    }
                    
                    const activity = await RecentActivity.findOne({
                        UserId: msg.UserId
                    });

                    if(activity)
                    {
                        activity.Activity = recentActivity;
                        activity.save();
                    }
                }
                //console.log("Mongo Success");
                callback(null, "Group Created Successfully");
            } else {
                err.status = "INTERNAL_SERVER_ERROR";
                err.data = "INTERNAL_SERVER_ERROR";
                //console.log("Mongo INTERNAL_SERVER_ERROR");
                callback(null, "INTERNAL_SERVER_ERROR");
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