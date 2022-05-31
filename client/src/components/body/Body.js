import React from "react";
import {Routes, Route} from 'react-router-dom'
import Login from './auth/Login'
import Register from './auth/Register'
import NotFound from "../utils/NotFound/NotFound";
import ResetPassword from "./auth/ResetPassword";
import Profile from "./profile/Profile";
import EditUser from "./profile/EditUser";
import Books from "./books/Books";
import DetailBook from "./detailbook/DetailBook";
import BooksList from "./booklist/BooksList";
import Introduction from "./introduction/Introduction";
import Blogs from "./blogs/Blogs";
import Genres from "./genres/Genres";
import AddBook from "./addbook/AddBook"
import SideBar from "../sidebar/SideBar"
import Pomodoro from "./pomodoro/Pomodoro";
import DetailBlog from "./detailBlog/DetailBlog";
import Write from "./write/Write";
import Subscription from "./subscription/Subscription";
import History from "./paiduser/History";
import ReadBook from "./readbook/ReadBook";
import About from "./about/About";

import {useSelector} from 'react-redux'

    
function Body(){
    const auth = useSelector(state => state.auth)
    const {isLogged, isAdmin, isEditor}=auth
    return(
        <>
        <div className="promote_banner0">
        </div>
        {/* <div className="promote_banner1">
        </div> */}
              <SideBar />
        <div className="body0">

        <section>
            <Routes>
                <Route path="/login" element={isLogged? <NotFound /> : <Login />} /> 
                <Route path="/register" element={isLogged? <NotFound /> : <Register />} /> 
                <Route path="/user/reset/:token" element={isLogged? <ResetPassword /> : <NotFound />} />
                <Route path="/profile" element={isLogged? <Profile /> : <Login />} />          
                <Route path="/edit_user/:id" element={isAdmin? <EditUser /> : <NotFound />} />
                <Route path="/about" element={<About />} />
                <Route path="/" element={<Books />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blog/:id" element={<DetailBlog />} />
                <Route path="/write" element={isLogged? <Write /> : <Login />} />
                <Route path="/edit_blog/:id" element={isLogged? <Write /> : <NotFound />} />          
                <Route path="/introduction" element={<Introduction />} />
                <Route path="/detail/:id" element={<DetailBook />} />  
                {/* <Route path="/bookslist" element={isLogged? <BooksList /> : <NotFound />} /> */}
                <Route path="/genres" element={isAdmin? <Genres /> : <NotFound />} />
                <Route path="/add_book" element={<AddBook />} />
                <Route path="/edit_book/:id" element={<AddBook />} />
                <Route path="/history" element={isAdmin? <History /> : <NotFound />} />
                <Route path="/pomodoro" element={isLogged? <Pomodoro /> : <Login />} /> 
                <Route path="/read_book/:id" element={isLogged? <ReadBook /> : <Login />} /> 

            </Routes>
        </section>
        
        </div>
        </>
    )
}

export default Body