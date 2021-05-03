const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const recentActivitySchema = new schema(
  {
    Id: {
      type: mongoose.Schema.Types.ObjectId,        
    },
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    Activity: {
      type: String,
      trim: true      
    }    
  },
  { versionKey: false }
);

const RecentActivity = mongoose.model("RecentActivity", recentActivitySchema);
module.exports = RecentActivity;