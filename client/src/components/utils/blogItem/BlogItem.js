import "./blogitem.css";
import { Link } from "react-router-dom";
import React, {useState, useEffect, useContext} from 'react'
import {fetchAllUsers, dispatchGetAllUsers} from '../../../redux/actions/usersAction'
import {useSelector, useDispatch} from 'react-redux'
import Rating from "../rating/Rating";


export default function BlogItem({ blog }) {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const users = useSelector(state => state.users)
    const [callback, setCallback] = useState(false)


    const {user, isAdmin} = auth
    const [rating, setRating] = useState(0)


  return (
    <div className="post">
      <img className="postImg" src={blog.images} alt="" />
      <div className="postInfo">
        {/* <div className="postCats">
          {post.categories.map((c) => (
            <span className="postCat">{c.name}</span>
          ))}
        </div> */}
        <Link to={`/blog/${blog._id}`} className="link">
          <span className="postTitle">{blog.title}</span>
        </Link>
        
        <hr />
        <p>
                Author: {blog.author_name}
        </p>
        <span className="postDate">
          {new Date(blog.createdAt).toDateString()}
        </span>
        
      </div>
      <p className="postDesc">{blog.summary}</p>
      <span className="postDate">Word: {blog.word}</span>
      <Rating props={blog}/>
      <span className="postDate">Review: {blog.numReviews}</span>
    </div>
    
  );
}