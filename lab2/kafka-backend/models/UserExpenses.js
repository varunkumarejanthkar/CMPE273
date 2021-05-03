const { Double } = require("bson");
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const userExpensesSchema = new schema(
  {
    ExpenseId: {
      type: mongoose.Schema.Types.ObjectId,        
    },
    UserId1: {
        type: mongoose.Schema.Types.ObjectId,      
        ref: "users"  
     },
    UserId2: {
        type: mongoose.Schema.Types.ObjectId,      
        ref: "users"         
     },
    GroupId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "groups"       
    },
    ExpenseDescription: {
      type: String,
      trim: true,      
    },
    Expense: {
      type: Number,
      trim: true,
      default: 0
    },
    ExpenseComments: {
      type: String,
      trim: true,     
    }    
  },
  { versionKey: false }
);

const UserExpenses = mongoose.model("userexpenses", userExpensesSchema);
module.exports = UserExpenses;