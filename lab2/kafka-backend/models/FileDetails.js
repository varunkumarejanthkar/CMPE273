const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const fileDetailsSchema = new schema(
  {
    FileId: {
      type: mongoose.Schema.Types.ObjectId,        
    },
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    FileBytes: {
      type: String,
      trim: true      
    }    
  },
  { versionKey: false }
);

const FileDetails = mongoose.model("filedetails", fileDetailsSchema);
module.exports = FileDetails;