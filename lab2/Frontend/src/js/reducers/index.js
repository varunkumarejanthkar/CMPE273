import { USER_LOGIN, USER_LOGOUT, USER_SIGNUP, USER_GROUPS } from "../constants/action-types";

const initialState = {
  user:{}
};

function rootReducer(state = initialState, action) {
    // if(action.type === REHYDRATE)
    // {
    //   return {
    //     ...state,
    //     user: action.payload 
    //   };
    // }
    // else
    if (action.type === USER_LOGIN) {
      console.log("processing in reducer User_Login");
      return {
        ...state, 
        user: action.payload
      };
    }
    else if(action.type === USER_LOGOUT)
    {
      console.log("processing in reducer User_Logout");
      return [];
    }
    else if(action.type === USER_SIGNUP)
    {
      console.log("processing in reducer User_Signup");
      return {
        ...state, 
        user: action.payload
      };
    }    
    else
      return state;
  }
  
export default rootReducer;