const User = require('../Model/Users');
var UserModel = require("../Model/UserModel");
//const { STATUS_CODE, MESSAGES } = require("../../utils/constants");

let handle_request = async (userModel) => {
    let response = {};
    let err = {};
    try {
        const user = await Users.findOne({
            email_id: userModel.email
        });       
        if (user) {
            err.status = "BAD_REQUEST";
            err.data = "USER_ALREADY_EXISTS";
            console.log("Mongo USER_ALREADY_EXISTS");
        } 
        else {
            let user = new Users({
                UserName: userModel.username,
                Password: userModel.password,
                Mail: userModel.email,
                DefaultCurrency: "Dollar",
                Language: "English",
                Last_Login: require("moment")().format("YYYY-MM-DD HH:mm:ss")                
            });
            const usersave = await user.save();
            if (usersave) {
                response.status = "SUCCESS";
                response.data = usersave._id;
                console.log("Mongo Success");
            } else {
                err.status = "INTERNAL_SERVER_ERROR";
                err.data = "INTERNAL_SERVER_ERROR";
                console.log("Mongo INTERNAL_SERVER_ERROR");
            }
        }
    } catch (error) {
        console.log(error);
        err.status = "INTERNAL_SERVER_ERROR";
        err.data = "INTERNAL_SERVER_ERROR";
        console.log("Mongo INTERNAL_SERVER_ERROR");
    }
}

exports.handle_request = handle_request;