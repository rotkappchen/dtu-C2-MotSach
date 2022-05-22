import React, {useState, useEffect} from 'react'
import axios from 'axios'

function BooksAPI(){
    const [books, setBooks] = useState([])
    const [callback, setCallback] = useState(false)
    const [genre, setGenre] = useState('')
    const [sort, setSort] = useState('')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)
    
   

    useEffect(()=>{

        const getBooks = async ()=>{
            const res = await axios.get(`api/books?limit=${page*9}&${genre}&${sort}&title[regex]=${search}`)
            setBooks(res.data.books) 
            setResult(res.data.result)
        }

        getBooks()
    }, [callback, genre, sort, search, page])


    return {
        books: [books, setBooks],
        callback: [callback, setCallback],
        genre: [genre, setGenre],
        sort: [sort, setSort],
        search: [search, setSearch],
        page: [page, setPage],
        result: [result, setResult]
    }
}

export default BooksAPI