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
        const user = await Users.findOne({
            Mail: msg.emailAddress
        });       
        if (user) {
            err.status = "BAD_REQUEST";
            err.data = "USER_ALREADY_EXISTS";
            callback(null, "USER_ALREADY_EXISTS");
            //console.log("USER_ALREADY_EXISTS");
        } 
        else {
            let user = new Users({
                UserName: msg.username,
                Password: encrypt(msg.password),
                Mail: msg.emailAddress,
                DefaultCurrency: "Dollar",
                Language: "English",
                Last_Login: require("moment")().format("YYYY-MM-DD HH:mm:ss")                
            });
            const usersave = await user.save();
            if (usersave) {                
                user.UserId = usersave._id;                
                //console.log("Mongo Success");
                callback(null, user);
            } else {
                err.status = "INTERNAL_SERVER_ERROR";
                err.data = "INTERNAL_SERVER_ERROR";
                //console.log("Mongo INTERNAL_SERVER_ERROR");
                callback(null, "INTERNAL_SERVER_ERROR");
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