import React, {useContext, useState} from 'react'
import {useSelector} from 'react-redux'
import {GlobalState} from '../../../GlobalState'
import BookItem from '../../utils/bookItem/BookItem'
import Loading from '../../utils/loading/Loading'
import axios from 'axios'
import Filters from './Filters'
import LoadMore from './LoadMore'

function Books(){
    const state = useContext(GlobalState)

    //console.log(state)
    const [books, setBooks] = state.booksAPI.books
    // const [isAdmin] = state.userAPI.isAdmin
    // const [isEditor] = state.userAPI.isEditor


    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const [callback, setCallback] = state.booksAPI.callback
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)
    const {isAdmin, isEditor} = auth
    const socket = state.socket
    console.log(socket)
    
    const handleCheck = (id) =>{
        books.forEach(book => {
            if(book._id === id) book.checked = !book.checked
        })
        setBooks([...books])
    }
    const deleteBook = async(id) => {
        try {
            // setLoading(true)
            // const destroyImg = axios.post('/api/destroy', {public_id},{
            //     headers: {Authorization: token}
            // })
            const deleteBook = axios.delete(`/api/books/${id}`, {
                headers: {Authorization: token}
            })

            //await destroyImg
            await deleteBook
            setCallback(!callback)
            setLoading(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }
    const checkAll = () =>{
        books.forEach(book => {
            book.checked = !isCheck
        })
        setBooks([...books])
        setIsCheck(!isCheck)
    }
    const deleteAll = () =>{
        books.forEach(book => {
            if(book.checked) deleteBook(book._id)
        })
    }

    return (
        <>
        <Filters />
        {
            isAdmin && 
            <div className="delete-all">
                <span>Select all</span>
                <input type="checkbox" checked={isCheck} onChange={checkAll} />
                <button onClick={deleteAll}>Delete ALL</button>
            </div>
        }
        <div className="products">
            {
                books.map(book =>{
                    return <BookItem key={book._id} book={book}
                    isAdmin={isAdmin} isEditor={isEditor} deleteBook={deleteBook} />
                })
            }
            
        </div>

        <LoadMore />

        {books.length === 0 && <Loading />}
        </>
    )
}

export default Books