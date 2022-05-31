import React, {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import {GlobalState} from '../../../GlobalState'
import Loading from '../../utils/loading/Loading'
import {useNavigate, useParams} from 'react-router-dom'
import {useSelector} from 'react-redux'


const initialState = {
    book_id: '',
    title: '',
    page: 0,
    description: 'This is the description of the book.',
    summary: 'This will appear in the book thumbnail.',
    author: '',
    genre: [],
    language:'',
    isBestSeller: false,
    isPromoted: false,
    sellerUrl: '',
    rating: 5,
    _id: ''
}

function CreateProduct() {
    const state = useContext(GlobalState)
    const [book, setBook] = useState(initialState)
    const [genres] = state.genresAPI.genres
    const [data, setData] = useState(initialState)
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)


    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    //const users = useSelector(state => state.users)

    const {isAdmin, isEditor} = auth

    const navigate = useNavigate()
    const param = useParams()

    const [books] = state.booksAPI.books
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.booksAPI.callback
    const [input, setInput] = useState('');
    const [tags, setTags] = useState([]);
    const [isKeyReleased, setIsKeyReleased] = useState(false);
    useEffect(() => {
        if(param.id){
            setOnEdit(true)
            books.forEach(book => {
                if(book._id === param.id) {
                    setBook(book)
                    setImages(book.images)
                }
            })
        }else{
            setOnEdit(false)
            setBook(initialState)
            setImages(false)
        }
    }, [param.id, books])

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

    const handleChangeInput = e =>{
        const {name, value} = e.target
        setBook({...book, [name]:value})
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        try {
            if(!isAdmin) return alert("You're not an admin")
            if(!images) return alert("No Image Upload")

            if(onEdit){
                await axios.put(`/api/books/${book._id}`, {...book, images, genre: tags}, {
                    headers: {Authorization: token}
                })
            }else{
                await axios.post('/api/books', {...book, images, genre: tags}, {
                    headers: {Authorization: token}
                })
            }
            setCallback(!callback)
            alert("Bood added to database!")
            navigate.push("/")
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const styleUpload = {
        display: images ? "block" : "none"
    }

    const addTag = (e) => {
        const { value } = e.target;
        e.preventDefault();
          setTags(prevState => [...prevState, value]);
      };

      const deleteTag = (index) => {
        setTags(prevState => prevState.filter((tag, i) => i !== index))
      }

      const onKeyDown = (e) => {
        const { key } = e;
        const trimmedInput = input.trim();
      
        if (key === ',' && trimmedInput.length && !tags.includes(trimmedInput)) {
          e.preventDefault();
          setTags(prevState => [...prevState, trimmedInput]);
          setInput('');
        }
      
        if (key === "Backspace" && !input.length && tags.length && isKeyReleased) {
          const tagsCopy = [...tags];
          const poppedTag = tagsCopy.pop();
          e.preventDefault();
          setTags(tagsCopy);
          setInput(poppedTag);
        }
      
        setIsKeyReleased(false);
      };
      
      const onKeyUp = () => {
        setIsKeyReleased(true);
      }

    console.log(images)

    return (
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload}/>
                {
                    loading ? <div id="file_img"><Loading /></div>

                    :<div id="file_img" style={styleUpload}>
                        <img src={images ? images : ''} alt=""/>
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
                
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="book_id">Book ID</label>
                    <input type="text" name="book_id" id="product_id" required
                    value={book.book_id} onChange={handleChangeInput} disabled={onEdit} />
                </div>

                <div className="row">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" required
                    value={book.title} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="author">Author</label>
                    <input type="text" name="author" id="title" required
                    value={book.author} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="language">Language</label>
                    <input type="text" name="language" id="title" required
                    value={book.language} onChange={handleChangeInput} />
                </div>
                
                <div className="row">
                    <label htmlFor="page">Page</label>
                    <input type="number" name="page" id="price" required
                    value={book.price} onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description" required
                    value={book.description} rows="5" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="content">Summary</label>
                    <textarea type="text" name="summary" id="content" required
                    value={book.summary} rows="7" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    <label htmlFor="author">Seller URL</label>
                    <input type="text" name="sellerUrl" id="title" required
                    value={book.sellerUrl} onChange={handleChangeInput} />
                </div>


                <div className="row">
                    <label htmlFor="genre">Genre: </label>
                    <select name="genre" value={book.genre} onChange={addTag} >
                        <option value="">Please select genres</option>
                        {
                            genres.map(genre => (
                                <option value={genre.title} key={genre.title}>
                                    {genre.title}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <div className="containerAddGenres" >
                        {tags.map((tag, index) => (
                            <div className="tag" onClick={() => deleteTag(index)}>
                                {tag}
                 </div>
                ))}
                </div>


                <button type="submit">{onEdit? "Update" : "Create"}</button>
            </form>
        </div>
    )
}

export default CreateProduct
