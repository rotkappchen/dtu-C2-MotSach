import { combineReducers } from "redux";
import auth from './authReducer'
import token from './tokenReducer'
import users from './usersReducer'
import list from './listReducers'


export default combineReducers({
    auth,
    token,
    users,
    list
})