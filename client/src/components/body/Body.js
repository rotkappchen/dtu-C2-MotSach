import React from "react";
import {Routes, Route} from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import NotFound from "../utils/NotFound/NotFound";
import ResetPassword from "./auth/ResetPassword";
import Profile from "./profile/Profile";
import EditUser from "./profile/EditUser";

import {useSelector} from 'react-redux'

    
function Body(){
    const auth = useSelector(state => state.auth)
    const {isLogged, isAdmin}=auth
    return(
        <section>
            <Routes>
                <Route path="/login" element={isLogged? <NotFound /> : <Login />} /> 
                <Route path="/register" element={isLogged? <NotFound /> : <Register />} /> 
                <Route path="/user/reset/:token" element={isLogged? <ResetPassword /> : <NotFound />} />
                <Route path="/profile" element={isLogged? <Profile /> : <NotFound />} />          
                <Route path="/edit_user/:id" element={isAdmin? <EditUser /> : <NotFound />} />          

            </Routes>
        </section>
    )
}

export default Body