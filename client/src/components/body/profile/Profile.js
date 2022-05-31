import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import {isLength, isMatch} from '../../utils/validation/Validation'
import {showSuccessMsg, showErrMsg} from '../../utils/notification/Notification'
import {fetchAllUsers, dispatchGetAllUsers} from '../../../redux/actions/usersAction'
//import BooksAPI from '../../../api/BooksAPI'
import { GlobalState } from '../../../GlobalState'
import { deleteFromList } from '../../../redux/actions/listActions'
import FilterBlog from '../blogs/FilterBlog'
import Filter from '../books/Filters'
import LoadMore from '../books/LoadMore'


const initialState = {
    name: '',
    password: '',
    cf_password: '',
    err: '',
    success: ''
}

function Profile() {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const users = useSelector(state => state.users)

    const {user, isAdmin} = auth
    const isEditor =user.role
    const [data, setData] = useState(initialState)
    const {name, password, cf_password, err, success} = data
    const [avatar, setAvatar] = useState(false)
    const [loading, setLoading] = useState(false)
    const [callback, setCallback] = useState(false)
    const state=useContext(GlobalState)
    const [books] = state.booksAPI.books
    const [blogs] = state.blogsAPI.blogs


    const dispatch = useDispatch()

    const list = localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];



    useEffect(() => {
        if(isEditor || isAdmin){
            fetchAllUsers(token).then(res =>{
                dispatch(dispatchGetAllUsers(res))
            })
        }
    },[token, isEditor, isAdmin, dispatch, callback])

    const handleChange = e => {
        const {name, value} = e.target
        setData({...data, [name]:value, err:'', success: ''})
    }

    const changeAvatar = async(e) => {
        e.preventDefault()
        try {
            const file = e.target.files[0]

            if(!file) return setData({...data, err: "No files were uploaded." , success: ''})

            if(file.size > 1024 * 1024)
                return setData({...data, err: "Size too large." , success: ''})

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
                return setData({...data, err: "File format is incorrect." , success: ''})

            let formData =  new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload_avatar', formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })

            setLoading(false)
            setAvatar(res.data.url)
            
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    const updateInfor = () => {
        try {
            axios.patch('/api/update', {
                name: name ? name : user.name,
                avatar: avatar ? avatar : user.avatar
            },{
                headers: {Authorization: token}
            })

            setData({...data, err: '' , success: "Updated Success!"})
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    const updatePassword = () => {
        if(isLength(password))
            return setData({...data, err: "Password must be at least 6 characters.", success: ''})

        if(!isMatch(password, cf_password))
            return setData({...data, err: "Password did not match.", success: ''})

        try {
            axios.post('/api/reset', {password},{
                headers: {Authorization: token}
            })

            setData({...data, err: '' , success: "Updated Success!"})
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    const handleUpdate = () => {
        if(name || avatar) updateInfor()
        if(password) updatePassword()
    }

    const handleDelete = async (id) => {
        try {
            if(user._id !== id){
                if(window.confirm("Are you sure you want to delete this account?")){
                    setLoading(true)
                    await axios.delete(`/api/delete/${id}`, {
                        headers: {Authorization: token}
                    })
                    setLoading(false)
                    setCallback(!callback)
                }
            }
            
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    const handleDeleteBook = async (id) => {
        try {
            if(user._id !== id){
                if(window.confirm("Are you sure you want to delete this book?")){
                    setLoading(true)
                    await axios.delete(`/api/books/${id}`, {
                        headers: {Authorization: token}
                    })
                    setLoading(false)
                    setCallback(!callback)
                }
            }
            
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    const handleDeleteBlog = async (id) => {
        try {
            if(user._id !== id){
                if(window.confirm("Are you sure you want to delete this blog?")){
                    setLoading(true)
                    await axios.delete(`/api/blogs/${id}`, {
                        headers: {Authorization: token}
                    })
                    setLoading(false)
                    setCallback(!callback)
                }
            }
            
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    const handleApproveBlog = async (id, userid, word) => {
        try {
                if(window.confirm("Are you sure you want to approve this blog?")){
                    setLoading(true)
                    await axios.patch(`/api/update_status/${id}`, {
                        status: 1
                    }, {
                        headers: {Authorization: token}
                    })
                            //     var newExp = 0
                            //     var test =0
                            //     var newLvl = 0
                            //     var userIDtemp 
                            //     const reward = 0
                            //     if (word>=500) reward = 5
                            //     if (word>=1000) reward = 10
                            //     if (word>=5000) reward = 50
                            //     users.forEach(user => {

                            //         if(user._id===userid){
                            //             userIDtemp=user._id
                            //             newExp = user.exp+reward
                            //             test =Math.round(4*(user.level*user.level*user.level)/5)
                            //             newLvl = user.level
                            //                 do {
                            //             newLvl=newLvl+1
                            //             test =Math.round(4*(newLvl*newLvl*newLvl)/5)
                            //                 } while (newExp>=test);
        
                            //         }
                                    
        
                                
                            // })
                    // await axios.patch(`/api/update_level/${userid}`,{
                    //         exp: newExp, level: newLvl
                    // }, {
                    //     headers: {Authorization: token}
                    // })

                    

                    setLoading(false)
                    setCallback(!callback)
                }
            }
            
        catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }


    return (
        <>
        <div>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            {loading && <h3>Loading.....</h3>}
        </div>
        <div className="profile_page">
            <div className="col-left">
                <h2>{isAdmin ? "Admin Profile": isEditor==2? "Editor Profile": "User Profile"}</h2>

                <div className="avatar">
                    <img src={avatar ? avatar : user.avatar} alt=""/>
                    <span>
                        <i className="fas fa-camera"></i>
                        <p>Change</p>
                        <input type="file" name="file" id="file_up" onChange={changeAvatar} />
                    </span>
                </div>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" defaultValue={user.name}
                    placeholder="Your name" onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Level</label>
                    <input type="email" name="email" id="email" defaultValue={user.level}
                    placeholder="Your email address" disabled />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Exp.</label>
                    <input type="email" name="email" id="email" defaultValue={user.exp}
                    placeholder="Your email address" disabled />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" defaultValue={user.email}
                    placeholder="Your email address" disabled />
                </div>

                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input type="password" name="password" id="password"
                    placeholder="Your password" value={password} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="cf_password">Confirm New Password</label>
                    <input type="password" name="cf_password" id="cf_password"
                    placeholder="Confirm password" value={cf_password} onChange={handleChange} />
                </div>

                <button disabled={loading} onClick={handleUpdate}>Update</button>
            </div>

            <div className="col-right">
                <h2>{isAdmin ? "Users" : ""}</h2>


                <div>{isAdmin ? 
                <>
                <div style={{overflowX: "auto"}}>
                    <table className="customers">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Admin</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {
                                                user.role === 1
                                                ? <p>Admin</p>
                                                : user.role === 2
                                                ? <p>Editor</p>
                                                : <p>Reader</p>
                                            }
                                        </td>
                                        <td>
                                            <Link to={`/edit_user/${user._id}`}>
                                                <i className="fas fa-edit" title="Edit"></i>
                                            </Link>
                                            <i className="fas fa-trash-alt" title="Remove"
                                            onClick={() => handleDelete(user._id)} ></i>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                    <h2>Manage Books</h2>
                    <div style={{overflowX: "auto"}}>
                        <Filter/>
                    <table className="customers">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                books.map(book => (
                                    <tr key={book._id}>
                                    <td><Link to={`/detail/${book._id}`}>{book.title}</Link></td>
                                        <td>{book.author}</td>
                                        <td>{book.createdAt}</td>
                                        <td>
                                            <Link to={`/edit_book/${book._id}`}>
                                                <i className="fas fa-edit" title="Edit"></i>
                                            </Link>
                                            <i className="fas fa-trash-alt" title="Remove"
                                            onClick={() => handleDeleteBook(book._id)} 
                                            >
                                            </i>
                                        </td>
                                    </tr>
                                ))
                                
                            }
                        </tbody>
                    </table>
                    <LoadMore/>
                    <Link to={`/add_book`}>
                        <i class="fa fa-plus" style={{background: "#555", color: "white", padding: "15px"}}></i>
                    </Link>                    </div>
                     </> : <>
                {
                    isEditor==2
                    ? <>
                    <h2>Pending Blogs</h2>
                    <div style={{overflowX: "auto"}}>
                    <FilterBlog/>
                    <table className="customers">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Writer</th>
                                <th>Word</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                blogs.map(blog => (
                                    blog.status=== 0 ?
                                    <><tr key={blog._id}>
                                    <td><Link to={`/blog/${blog._id}`}>{blog.title}</Link></td>
                                    <td>{blog.author_name}</td>
                                    <td>{blog.word}</td>
                                    <td>{blog.createdAt}</td>
                                    <td>
                                        <i className="fas fa-edit" title="Edit"  
                                        onClick={() => handleApproveBlog(blog._id)}></i>
                                        <i className="fas fa-trash-alt" title="Remove"
                                        onClick={() => handleDeleteBlog(blog._id, blog.author, blog.word)} 
                                        >
                                        </i>
                                    </td>
                                </tr></>
                                :
                                <></>
                            ))
                                
                            }
                        </tbody>
                    </table>
                    </div>
                    <h2>Manage Books</h2>
                    <div style={{overflowX: "auto"}}>
                    <Filter/>
                    <table className="customers">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                books.map(book => (
                                    <tr key={book._id}>
                                    <td><Link to={`/detail/${book._id}`}>{book.title}</Link></td>
                                        <td>{book.author}</td>
                                        <td>{book.createdAt}</td>
                                        <td>
                                            <Link to={`/edit_book/${book._id}`}>
                                                <i className="fas fa-edit" title="Edit"></i>
                                            </Link>
                                            <i className="fas fa-trash-alt" title="Remove"
                                            // onClick={() => handleDelete(user._id)} 
                                            >
                                            </i>
                                        </td>
                                    </tr>
                                ))
                                
                            }
                        </tbody>
                    </table>
                    <LoadMore/>
                    <Link to={`/add_book`}>
                        <i class="fa fa-plus" style={{background: "#555", color: "white", padding: "15px"}}></i>
                    </Link>
                    </div>
                    </>
                    : ""
                }
                <h2>My Blogs</h2>
                
                <div style={{overflowX: "auto"}}>
                    <table className="customers">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Author</th>
                                <th>Created At</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                               blogs.map(blog => (
                                    blog.author === user._id ?
                                     
                                    <><tr key={blog._id}>
                                    <td><Link to={`/blog/${blog._id}`}>{blog.title}</Link></td>
                                    <td>{blog.author_name}</td>
                                    
                                    <td>{blog.createdAt}</td>
                                    {
                                        blog.status === 1?
                                        <td>Approved</td>
                                        : <td>Pending</td>
                                    }
                                    <td>
                                        <Link to={`/edit_blog/${blog._id}`}>
                                            <i className="fas fa-edit" title="Edit"></i>
                                        </Link>
                                        <i className="fas fa-trash-alt" title="Remove"
                                        onClick={() => handleDeleteBlog(blog._id)} 
                                        >
                                        </i>
                                    </td>
                                </tr></>
                                :
                                <></>
                                    
                                
                            ))

                            }
                        </tbody>
                    </table>
                    <Link to={`/write`}>
                    <i class="fa fa-plus" style={{background: "#555", color: "white", padding: "15px"}}></i>
                    </Link>
                </div>
                <h2>My Favorite lists</h2>
                <div style={{overflowX: "auto"}}>
                    <table className="customers">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Author</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                list.map(listItem => (
                                    <tr key={listItem._id}>
                                    <td><Link to={`/detail/${listItem._id}`}>{listItem.title}</Link></td>
                                        <td>{listItem.author}</td>
                                        <td>
                                        <Link to={`/profile`}>
                                            <i className="fas fa-trash-alt" title="Remove"
                                            onClick={() => dispatch(deleteFromList(listItem))} 
                                            >
                                            </i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                                
                            }
                        </tbody>
                    </table>
                    <i class="fa fa-plus" style={{background: "#555", color: "white", padding: "15px"}}></i>
                </div>
                </> }

                </div>
            </div>
        </div>



        </>
    )
}

export default Profile
