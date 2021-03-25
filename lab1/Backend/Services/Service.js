"use strict";
var UserModel = require("../Model/UserModel");
var dbConnect = require("../Database/DBConnect");
var crypto = require("crypto");
const { resolve } = require("path");

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
  dbConnect.saveSignUpDetails(userModel)
  .then(function(){
    dbConnect.GetUserDetails(userModel)
    .then(function(results){
      resolve(results[0]);
    })
    .catch(function(err) {
      reject("Not Unique mail : " + err);
    })
  })
  .catch(function(err){
    reject("Not Unique mail : " + err);
  })
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

const createGroup = (userId, groupName, userNameArray, emailArray, userIdArray) => {
    //return dbConnect.createGroup(userId, groupName, userIdArray, emailArray);
   // return new Promise(function (resolve, reject) {
      dbConnect.createGroup(userId, groupName, userNameArray, emailArray)
        .then(function (results) {    
          dbConnect.getGroupDetails(groupName)
          .then(function(result){
            const groupId = result;
            dbConnect.InsertUserGroupRelationships(userId, groupName, userNameArray, emailArray, userIdArray, groupId)
            .then(function(result){
              resolve("Success");
            }) 
            .catch(function(err){
              console.log("Promise rejection error: " + err);
              reject();
            }) 
            //resolve();          
          })     
          .catch(function(err){
            console.log("Promise rejection error: " + err);
            reject();
          })          
        })
        .catch(function (err) {
          console.log("Promise rejection error: " + err);
          reject();
        });          
}

const getAllUserDetails = () => {
  return dbConnect.getAllUserDetails();
}

const IsGroupCreated = (groupName) => {
  return dbConnect.IsGroupCreated(groupName);  
}

const getAllGroupDetails = (userId) => {
  return dbConnect.getAllGroupDetails(userId);  
}

const getAllExpensesDetails = (userId) => { 
  return dbConnect.getAllExpensesDetails(userId);
}

const saveExpense = (expense, groupName, expenseDescription, userName, groupId, userId) => {
  return dbConnect.saveExpense(expense, groupName, expenseDescription, userName, groupId, userId);
}

const GetGroupInvitationDetails = (userId) => {
  return dbConnect.GetGroupInvitationDetails(userId);
}

const saveInvitation = (userId, groupId) => {
  return dbConnect.saveInvitation(userId, groupId);
}

const leaveGroup = (userId, groupId) => {
  return dbConnect.leaveGroup(userId, groupId);
}

const settleUpExpenses = (userId, userName2, userId2) => {
  return dbConnect.settleUpExpenses(userId, userName2, userId2);
}

const saveFile = (fileBytes, userId) => {
  return dbConnect.saveFile(fileBytes, userId);
}

exports.signupService = signupService;
exports.loginService = loginService;
exports.updateUserDetails = updateUserDetails;
exports.createGroup = createGroup;
exports.getAllUserDetails = getAllUserDetails;
exports.IsGroupCreated = IsGroupCreated;
exports.getAllGroupDetails = getAllGroupDetails;
exports.getAllExpensesDetails = getAllExpensesDetails;
exports.saveExpense = saveExpense;
exports.GetGroupInvitationDetails = GetGroupInvitationDetails;
exports.saveInvitation = saveInvitation;
exports.leaveGroup = leaveGroup;
exports.settleUpExpenses = settleUpExpenses;
exports.saveFile = saveFile;