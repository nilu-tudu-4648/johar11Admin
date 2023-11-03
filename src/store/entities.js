import { combineReducers } from "redux";
import userReducer from "./userReducer";
import playersReducer from "./playersReducer";
import adminReducer from "./adminReducer";

export default combineReducers({
    userReducer,
    playersReducer,
    adminReducer
});
