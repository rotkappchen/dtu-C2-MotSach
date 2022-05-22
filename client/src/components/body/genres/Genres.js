import React, {useState, useContext} from 'react'
import {GlobalState} from '../../../GlobalState'
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux'


function Categories() {
    const state = useContext(GlobalState)
    const [genres] = state.genresAPI.genres
    const [genre, setGenre] = useState('')
    const token = useSelector(state => state.token)
    const [callback, setCallback] = state.genresAPI.callback
    const [onEdit, setOnEdit] = useState(false)
    const [id, setID] = useState('')

    const createGenre = async e =>{
        e.preventDefault()
        try {
            if(onEdit){
                const res = await axios.put(`/api/genre/${id}`, {title: genre}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
            }else{
                const res = await axios.post('/api/genre', {title: genre}, {
                    headers: {Authorization: token}
                })
                alert(res.data.msg)
            }
            setOnEdit(false)
            setGenre('')
            setCallback(!callback)
            
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const editGenre = async (id, name) =>{
        setID(id)
        setGenre(name)
        setOnEdit(true)
    }

    const deleteGenre = async id =>{
        try {
            const res = await axios.delete(`/api/genre/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    return (
        <div className="categories">
            <form onSubmit={createGenre}>
                <label htmlFor="category">Genre</label>
                <input type="text" name="category" value={genre} required
                onChange={e => setGenre(e.target.value)} />

                <button type="submit">{onEdit? "Update" : "Create"}</button>
            </form>

            <div className="col">
                {
                    genres.map(genre => (
                        <div className="row" key={genre._id}>
                            <p>{genre.title}</p>
                            <div>
                                <button onClick={() => editGenre(genre._id, genre.name)}>Edit</button>
                                <button onClick={() => deleteGenre(genre._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Categories
