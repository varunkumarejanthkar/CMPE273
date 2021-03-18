const mysql = require("mysql");
const UserModel = require("../Model/UserModel");

const createConnection = () => {
  const con = mysql.createConnection({
    host: "splitwisedatabase.cwgv9f0vak1r.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "Splitwise12345",
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });
  return con;
};

const saveSignUpDetails = function (userModel) {
  const con = createConnection();
  const records = [
    [
      userModel.username,
      userModel.password,
      userModel.email,
      "Dollar",
      "English",
      require("moment")().format("YYYY-MM-DD HH:mm:ss"),
    ],
  ];

  return new Promise(function (resolve, reject) {
    con.query(
      "Insert into `dbo.splitwise`.Users(UserName, Password, Mail, DefaultCurrency, Language, Last_Login) values ?",
      [records],
      function (err, result, fields) {
        if (err) {
          con.end();
          console.log(err);
          reject(new Error("Not Unique Email"));
        }
        if (result) {
          //console.log(result);
          con.end();
          resolve();
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
        if (err) {
          con.end();
          console.log(err);
          reject(new Error("User doesn't exists"));
        }
        if (result) {
          //console.log(result);
          con.end();
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
      "Select * from `dbo.splitwise`.Users where Mail = ?",
      [userModel.email],
      function (err, result, fields) {
        if (err) {
          con.end();
          console.log("Inside GetUserDetails : " + err);
          reject(new Error("User Doesn't exist"));
        }
        if (result) {
          console.log(result);
          if (result.length == 0) {
            console.log("Inside GetUserDetails : User doesn't exist");
            reject(new Error("User Doesn't exist"));
          } else {
            console.log("Inside GetUserDetails : " + result[0].UserId);
            con.end();
            resolve(result);
          }
        }
      }
    );
  });
};

exports.saveSignUpDetails = saveSignUpDetails;
exports.GetUserDetails = GetUserDetails;
exports.saveUserDetails = saveUserDetails;
