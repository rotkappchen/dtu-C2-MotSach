import React, {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import {GlobalState} from '../../../GlobalState'
import Loading from '../../utils/loading/Loading'
import {useNavigate, useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'


function Write(){
    
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    //const users = useSelector(state => state.users)

    const {user, isLogged} = auth

    const initialState = {
        title: '',
        word: 0,
        content: '',
        summary: '',
        author: user._id,
        author_name: user.name,
        status: 0,
        _id: ''
    }

    //console.log(initialState)

    const state = useContext(GlobalState)
    const [blog, setBlog] = useState(initialState)
    const [data, setData] = useState(initialState)
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)
    
    console.log(blog)

    

    const navigate = useNavigate()
    const param = useParams()

    const [blogs] = state.blogsAPI.blogs
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.blogsAPI.callback

    useEffect(() => {
        if(param.id){
            setOnEdit(true)
            blogs.forEach(blog => {
                if(blog._id === param.id) {
                    setBlog(blog)
                    setImages(blog.images)
                }
            })
        }else{
            setOnEdit(false)
            setBlog(initialState)
            setImages(false)

        }
    }, [param.id, blogs])



    const handleUpload = async e =>{
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
            setImages(res.data.url)
            
        } catch (err) {
            setData({...data, err: err.response.data.msg , success: ''})
        }
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        try {
            if(!isLogged) return alert("You're not logged in")
            if(!images) return alert("No Image Upload")

            

            if(onEdit){
                await axios.put(`/api/blogs/${blog._id}`, {...blog, images}, {
                    headers: {Authorization: token}
                })
            }else{
                await axios.post('/api/blogs', {...blog, images}, {
                    headers: {Authorization: token}
                })
            }
            setCallback(!callback)
            navigate.push("/")
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestroy = async () => {
        try {
            // if(!isAdmin) return alert("You're not an admin")
            // setLoading(true)
            // await axios.post('/api/destroy', {public_id: images.public_id}, {
            //     headers: {Authorization: token}
            // })
            // setLoading(false)
            // setImages(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const styleUpload = {
        display: images ? "block" : "none"
    }

    const handleChangeInput = e =>{
        const {name, value} = e.target
        setBlog({...blog, [name]:value})
    }


    return (
        <div>
             <div className="write">
             <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload}/>
                {
                    loading ? <div id="file_img"><Loading /></div>

                    :<div id="file_img" style={styleUpload}>
                        <img  src={images ? images : ''} alt=""/>
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
                
        </div>
        <form className="writeForm" onSubmit={handleSubmit}>

                <div className="row">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" required
                    value={blog.title} onChange={handleChangeInput} />
                </div>

                <div className="writeFormGroup">
                    <label htmlFor="content">Summary</label>
                    <textarea type="text" name="summary" id="content" required
                    value={blog.summary}
                    placeholder="Summarize your blog..."
                    rows="5" onChange={handleChangeInput} />
                </div>
        <div className="writeFormGroup">
        <label htmlFor="content">Content</label>
          <textarea
            placeholder="Tell your story..."
            type="text"
            className="writeInput writeText"
            name="content" id="description" required
            value={blog.content}
            rows="20"
            onChange={handleChangeInput}
          ></textarea>
        </div>
        
        <button className="writeSubmit" type="submit">
        {onEdit? "Update" : "Publish"}
        </button>
      </form>
    </div>
        </div>
    )
}

export default Write