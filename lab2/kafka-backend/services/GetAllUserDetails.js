const Users = require('../models/Users');

  let handle_request = async(msg, callback) => { 
    let response = {};
    let err = {};
    try {
        const user = await Users.find();
        callback(null, user);        
    } catch (error) {
        console.log(error);
        err.status = "INTERNAL_SERVER_ERROR";
        err.data = "INTERNAL_SERVER_ERROR";
        //console.log("Mongo INTERNAL_SERVER_ERROR");
        callback(null, "INTERNAL_SERVER_ERROR");
    }
};

exports.handle_request = handle_request;