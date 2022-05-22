import {useState, useEffect} from 'react'
import axios from 'axios'

function GenresAPI(){
    const [genres, setGenres] = useState([])
    const [callback, setCallback] = useState(false)


    useEffect(()=>{

        const getGenres = async ()=>{
            const res = await axios.get('/api/genre')
            setGenres(res.data) 
        }

        getGenres()
    }, [callback])


    return {
        genres: [genres, setGenres],
        callback: [callback, setCallback]
    }
}

export default GenresAPI