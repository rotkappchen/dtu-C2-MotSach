import React, {useContext, useState, useEffect, useRef} from 'react'
import {useParams, Link} from 'react-router-dom'
import {GlobalState} from '../../../GlobalState'
import {useSelector, useDispatch} from 'react-redux'
import Rating from '../../utils/rating/Rating'
import Loading from '../../utils/loading/Loading'
import FormInputBlog from '../../utils/formInput/FormInputBlog'
import {getData} from '../../utils/FetchData'
import CommentItem from '../../utils/commentItem/CommentItem'
import axios from 'axios'
import ShareLink from 'react-facebook-share-link'

import './detailblog.css'


function DetailBlog(){

    const params = useParams()
    const state = useContext(GlobalState)
    const [blogs] = state.blogsAPI.blogs
    const [detailBlog, setDetailBlog] = useState([])
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [rating, setRating] = useState(0)
    const [comments, setComments] = useState([])
    const [page, setPage] = useState(1)
    const pageEnd = useRef()
    const socket = state.socket
    const auth = useSelector(state => state.auth)
    const {user, isLogged, isAdmin} = auth
    const token = useSelector(state => state.token)
    const [callback, setCallback] = useState(false)


    // Get Blog Info
    useEffect(()=>{
        if(params.id){
            blogs.forEach(blog => {
                if(blog._id === params.id) setDetailBlog(blog)
            });
        }
        
    }, [params.id, blogs])

    //console.log(detailBlog)

    // Comment 
    useEffect(() => {
        setLoading(true)
        getData(`/api/comments/${params.id}?limit=${page * 5}`)
            .then(res => {
                setComments(r => r = res.data.comments)
                setLoading(false)
            })
            .catch(err => console.log(err.response.data.msg))
    },[params.id, page])

    // Realtime 
    // Join room
    useEffect(() => {
        if(socket){
            socket.emit('joinRoom', params.id)
        }
    },[socket, params.id])

    useEffect(() => {
        if(socket){
            socket.on('sendCommentToClient', msg => {
                setComments([msg, ...comments])
            })

            return () => socket.off('sendCommentToClient')
        } 
    },[socket, comments])

    useEffect(() => {
        if(socket){
            socket.on('sendReplyCommentToClient', msg => {
                const newArr = [...comments]
                
                newArr.forEach(cm => {
                    if(cm._id === msg._id){
                        cm.reply = msg.reply
                    }
                })

                setComments(newArr)
            })

            return () => socket.off('sendReplyCommentToClient')
        } 
    },[socket, comments])

    const handleDelete = async (id) => {
              if(window.confirm("Are you sure you want to delete this blog?")){
                  setLoading(true)
                  await axios.delete(`/api/blogs/${id}`, {
                      headers: {Authorization: token}
                  })
                  setLoading(false)
                  setCallback(!callback)
              }
          
      }
  

    return (
    <div className="singlePost">
      {
            user._id === detailBlog.author 
            ?<>
            <Link to={`/edit_blog/${detailBlog._id}`}>
            <button className="writeSubmit" type="submit">
          EDIT
        </button>         
             </Link>
             <button className="writeSubmit" onClick={() => handleDelete(detailBlog._id)}>
          DELETE
        </button> 

            </>  
              : <></>
      }
      <div className="singlePostWrapper">
          <img src={detailBlog.images} alt="" className="singlePostImg" />
        {/* {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="singlePostTitle">
            {title}
            {post.username === user?.username && (
              <div className="singlePostEdit">
                <i
                  className="singlePostIcon far fa-edit"
                  onClick={() => setUpdateMode(true)}
                ></i>
                <i
                  className="singlePostIcon far fa-trash-alt"
                  onClick={handleDelete}
                ></i>
              </div>
            )}
          </h1>
        )} */}
      
        
       
        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            {/* <Link to={`/?user=${post.username}`} className="link"> */}
              <b> {detailBlog.author_name}</b>
            {/* </Link> */}
          </span>
          <h1>{detailBlog.title}</h1>
          <span className="singlePostDate">
            {new Date(detailBlog.createdAt).toDateString()}
          </span>
        </div>
        <p className="singlePostDesc">{detailBlog.content}</p>
        {/* {updateMode ? (
          <textarea
            className="singlePostDescInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        ) : (
          <p className="singlePostDesc">{desc}</p>
        )}
        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )} */}
      </div>
      <div className='sharebutton'>
      <ShareLink link='' >
          {link => (
              <a href={link} target='_blank'>Share this on Facebook</a>
          )}
      </ShareLink>
      </div>

      <h2>Rating: {detailBlog.numReviews} reviews</h2>
                <Rating props={detailBlog}/>

                <div className="comments">

                <div className="reviews">
                    <input type="radio" name="rate" id="rd-5" onChange={() => setRating(5)} />
                    <label htmlFor="rd-5" className="fas fa-star"></label>

                    <input type="radio" name="rate" id="rd-4" onChange={() => setRating(4)} />
                    <label htmlFor="rd-4" className="fas fa-star"></label>

                    <input type="radio" name="rate" id="rd-3" onChange={() => setRating(3)} />
                    <label htmlFor="rd-3" className="fas fa-star"></label>

                    <input type="radio" name="rate" id="rd-2" onChange={() => setRating(2)} />
                    <label htmlFor="rd-2" className="fas fa-star"></label>

                    <input type="radio" name="rate" id="rd-1" onChange={() => setRating(1)} />
                    <label htmlFor="rd-1" className="fas fa-star"></label>
                </div>

                <FormInputBlog id={params.id} socket={socket} rating={rating} isLogged={isLogged} user={user}/>

                <div className="comments_list">
                    {
                        comments.map(comment => (
                            <CommentItem key={comment._id} comment={comment} socket={socket} />
                        ))
                    }
                </div>

            </div>
            {
                loading && <div className="loading"><img src={Loading} alt=""/></div>
            }  
            <button ref={pageEnd} style={{opacity: 0}}>Load more</button>

    </div>
    )
}

export default DetailBlog