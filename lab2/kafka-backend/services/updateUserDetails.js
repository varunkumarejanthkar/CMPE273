const Users = require('../models/Users');
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


  let handle_request = async(msg, callback) => { 
    let response = {};
    let err = {};
    try {
        let user = await Users.findById(msg.user_id);

        if(user){
            user.is_active = true;
            user.UserName = msg.UserName;
            user.Password = encrypt(msg.Password);            
            user.Phone_Number = msg.Phone_Number;
            user.DefaultCurrency = msg.DefaultCurrency;
            user.Language = msg.Language;
            activeUser = await user.save();
            callback(null, "User Details Saved Successfully");
        }        
    }catch (error) {
        console.log(error);
        err.status = "INTERNAL_SERVER_ERROR";
        err.data = "INTERNAL_SERVER_ERROR";
        //console.log("Mongo INTERNAL_SERVER_ERROR");
        callback(null, "INTERNAL_SERVER_ERROR");
         }
  };

exports.handle_request = handle_request;