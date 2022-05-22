import React from 'react'
import BtnRender from './BtnRender'
import Rating from '../rating/Rating'
import {Link} from 'react-router-dom'

function BookItem({book, isAdmin, isEditor, deleteBook, handleCheck}){
    return (
        
        <div className='product_card' >

            {/* {
                isAdmin || isEditor && <input type="checkbox" checked={book.checked}
                onChange={() => handleCheck(book._id)} />
            } */}

            {
                isAdmin ?
                <input type="checkbox" checked={book.checked} 
                onChange={() => handleCheck(book._id)}/>
                : <></>
            }
            <Link to={`/detail/${book._id}`}>

            <img src={book.images} alt="" />
        

            <div className='product_box'>
                <h2 title={book.title}>{book.title}</h2>
                <span>Author: {book.author}</span>
                <p>{book.summary}</p>
            </div>
            <div>
                    <h5>Rating: {book.numReviews} reviews</h5>
                <Rating props={book}/>
                </div>

                </Link>
            <BtnRender book={book} deleteBook={deleteBook}></BtnRender>
            
        </div>
        
    )
}

export default BookItem