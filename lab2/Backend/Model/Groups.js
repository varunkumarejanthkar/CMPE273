const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const groupsSchema = new schema(
  {
    GroupId: {
      type: mongoose.Schema.Types.ObjectId,        
    },
    GroupName: {
      type: String,
      trim: true,
      required: true
    },
    GroupType: {
      type: String,
      trim: true,
      default: "Other"
    },    
    GroupSize: {
      type: Number,            
      default: 0
    },
    CreatedDate: {
      type: Date,
      default: Date.now(),     
    },       
    Users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }]    
  },
  { versionKey: false }
);

const Groups = mongoose.model("Groups", groupsSchema);
module.exports = Groups;