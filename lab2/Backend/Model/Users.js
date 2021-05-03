const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const userSchema = new schema(
  {
    UserId: {
      type: mongoose.Schema.Types.ObjectId,        
    },
    UserName: {
      type: String,
      trim: true,
      required: true
    },
    Password: {
      type: String,
      trim: true,
      required: true
    },
    Mail: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    Phone_Number: {
      type: String,
      trim: true     
    },
    Last_Login: {
      type: Date,
      default: Date.now(),     
    },
    DefaultCurrency: {
      type: String,
      trim: true,
      default: "Dollar"
    },
    Language: {
      type: String,
      trim: true,
      default: "English"
    },    
    Groups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "groups"
    }]    
  },
  { versionKey: false }
);

const Users = mongoose.model("Users", userSchema);
module.exports = Users;