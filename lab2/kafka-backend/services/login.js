const Users = require('../models/Users');
const FileDetails = require('../models/FileDetails');
var crypto = require("crypto");

const encrypt = (password) => {
    const algorithm = "aes256"; // or any other algorithm supported by OpenSSL
    const key = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
    const iv = "zAvR2NI87bBx746n";
    var ivstring = iv.toString('hex').slice(0, 16);  
    const cipher = crypto.createCipheriv(algorithm, key, ivstring);
    const encrypted = cipher.update(password, "utf8", "hex") + cipher.final("hex");
    return encrypted;
  };

let handle_request = async (msg, callback) => { 
    let response = {};
    let err = {};
    try {
        const user = await Users.findOne({
            Mail: msg.mail,
            Password: encrypt(msg.password)
        });       
        if (user) {           
            const activeUser = await user.save();
            let userData = {
                UserId: activeUser._id,
                UserName: activeUser.UserName,
                Mail: activeUser.Mail,
                Language: activeUser.Language,
                DefaultCurrency: activeUser.DefaultCurrency,
                Last_Login: activeUser.Last_Login
            };

            const activeUserFileDetails = await FileDetails.findOne({
                UserId: activeUser.UserId                
            })

            if(activeUserFileDetails)
            {
                const fileDetails = activeUserFileDetails.save();
                userData.FileBytes = fileDetails.FileBytes;
            }

           
            response.data = userData;
            return callback(null, response);
        } 
        else {           
            err.status = "User doesn't Exists";
            err.data = "User doesn't Exists";
            //console.log("Mongo INTERNAL_SERVER_ERROR");
            callback(null, "User doesn't Exists");            
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