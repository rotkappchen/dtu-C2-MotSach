import React, {useContext, useState} from 'react'
import {Link} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import { addToList } from '../../../redux/actions/listActions'



function BtnRender({book, deleteBook, favBookList}) {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const users = useSelector(state => state.users)

    const {isAdmin, isLogged, isEditor} = auth
    //const addCart = state.userAPI.addCart
    const dispatch = useDispatch()

    const handleAdd = () => {
                dispatch(addToList(book))
                alert("Book added to favorite list!")
            
    }
    return (
        <div className="row_btn">
            {
                isAdmin ?
                <>
                    <Link id="btn_buy" to="#!" 
                    onClick={() =>deleteBook(book._id, book.images)}>
                        Delete
                    </Link>
                    <Link id="btn_view" to={`/edit_book/${book._id}`}>
                        Edit
                    </Link>
                </>
                : <>
                {
                    isLogged ?
                    // <Link id='btn_read' to={`/read_book/${book._id}`}>
                    <Link id='btn_read' to={`/pomodoro`}>
                    Read
                </Link>
                :  <Link id='btn_read' to={`/login`}>
                Read
            </Link>
            
                    
                }
                   
                    <Link id='btn_buy' to="/" onClick={handleAdd}>
                        Favorite
                    </Link>
                    <Link id='btn_view' to={`/detail/${book._id}`}>
                        View
                    </Link>
                </>
            }
                
        </div>
    )
}

export default BtnRender
