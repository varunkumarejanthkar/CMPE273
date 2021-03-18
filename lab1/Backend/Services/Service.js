"use strict";
var UserModel = require("../Model/UserModel");
var dbConnect = require("../Database/DBConnect");
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

const decrypt = (encryptedCode) => {
  const algorithm = "aes256"; // or any other algorithm supported by OpenSSL
  const key = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
  const iv = "zAvR2NI87bBx746n";
  var ivstring = iv.toString('hex').slice(0, 16);
  const decipher = crypto.createDecipheriv(algorithm, key, ivstring);
  const decrypted = decipher.update(encryptedCode, "hex", "utf8") + decipher.final("utf8");
  return decrypted;
};

const signupService = (userModel) => {
  userModel.password = encrypt(userModel.password);
  return dbConnect.saveSignUpDetails(userModel);
};

const loginService = (userModel) => {
  return new Promise(function (resolve, reject) {
    dbConnect
      .GetUserDetails(userModel)
      .then(function (results) {
        //console.log("UserID : " + results[0].UserId);
        //return true;
        console.log("Inside loginService : " + results);
        const decryptedPassword = decrypt(results[0].Password);
        console.log("decryptedPassword : " + decryptedPassword + " : userModel.Password : " + userModel.Password);
        if(userModel.password == decryptedPassword)
        {
          results[0].Password = decryptedPassword;
          resolve(results);
        }
        else
        {
           reject("Incorrect Password");
        }
        //resolve(results);
      })
      .catch(function (err) {
        console.log("Promise rejection error: " + err);
        reject(err);
      });
  });
}

const updateUserDetails = (userModel) => {
    userModel.password = encrypt(userModel.password);
    return dbConnect.saveUserDetails(userModel);
}


exports.signupService = signupService;
exports.loginService = loginService;
exports.updateUserDetails = updateUserDetails;

