import React, {useContext, useState} from 'react'
import {useSelector} from 'react-redux'
import {GlobalState} from '../../../GlobalState'
import axios from 'axios'
import BlogItem from '../../utils/blogItem/BlogItem'
import './blog.css'
import {Link} from 'react-router-dom'
import FilterBlog from './FilterBlog'
import Loading from '../../utils/loading/Loading'
import LoadMoreBlog from './LoadMoreBlog'


function Blogs(){
    const state = useContext(GlobalState)
    const [blogs, setBlogs] = state.blogsAPI.blogs
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const users = useSelector(state => state.users)

    const {user, isAdmin} = auth
    return (
        <div>
            
            <FilterBlog/>
            <div className="posts">
                {blogs.map(blog => (
                    blog.status === 1 ?
                    <>
                    <Link to={`/blog/${blog._id}`}>

                        <BlogItem blog={blog} />
                    </Link>
                    </>
                    : <></>
                    

                ))}
            </div>
            <LoadMoreBlog />

        {blogs.length === 0 && <Loading />}
        </div>
    )
}

export default Blogs