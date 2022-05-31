import React, {useContext, useState, useEffect, useRef} from 'react'
import {useParams, Link} from 'react-router-dom'
import {GlobalState} from '../../../GlobalState'
import BookItem from '../../utils/bookItem/BookItem'
import {useSelector, useDispatch} from 'react-redux'
import { addToList } from '../../../redux/actions/listActions'
import Rating from '../../utils/rating/Rating'
import Loading from '../../utils/loading/Loading'
import FormInput from '../../utils/formInput/FormInput'
import {getData} from '../../utils/FetchData'
import CommentItem from '../../utils/commentItem/CommentItem'
import ShareLink from 'react-facebook-share-link'


function DetailBook(){
    const params = useParams()
    const state = useContext(GlobalState)
    const [books] = state.booksAPI.books
    const [detailBook, setDetailBook] = useState([])
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [rating, setRating] = useState(0)
    const [comments, setComments] = useState([])
    const [page, setPage] = useState(1)
    const pageEnd = useRef()
    const socket = state.socket
    const auth = useSelector(state => state.auth)
    const {user, isLogged, isAdmin} = auth

    // Get Book Info
    useEffect(()=>{
        if(params.id){
            books.forEach(book => {
                if(book._id === params.id) setDetailBook(book)
            });
        }
        
    }, [params.id, books])

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

     // infiniti scroll
    //  useEffect(() => {
    //     const observer = new IntersectionObserver(entries => {
    //         if(entries[0].isIntersecting){
    //             setPage(prev => prev + 1)
    //         }
    //     },{
    //         threshold: 0.1
    //     })

    //     observer.observe(pageEnd.current)
    // },[])


    // Reply Comments
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

    if(detailBook.length === 0) return null;

    function findCommonElement(array1, array2) {
     
        // Loop for array1
        for(let i = 0; i < array1.length; i++) {
             
            // Loop for array2
            for(let j = 0; j < array2.length; j++) {
                 
                // Compare the element of each and
                // every element from both of the
                // arrays
                if(array1[i] === array2[j]) {
                 
                    // Return if common element found
                    return true;
                }
            }
        }
         
        // Return if no common element exist
        return false;
    }

    const detailGenre = detailBook.genre
    const detailGenreText = detailGenre.join(", ")
    const handleAdd = () => {
                dispatch(addToList(detailBook))
                alert("Book added to favorite list!")
            
    }

    //console.log(detailBook.sellerUrl)

    return (
        <>
            <div className="detail">
                <img src={detailBook.images} alt="" />
                <div className="box-detail">
                    <div className="row">
                        <h2>{detailBook.title}</h2>
                    </div>
                    <span>Author: {detailBook.author}</span>
                    <div className='book_detail'>
                    <p>Page: {detailBook.page}</p>
                    <p>Genre: {detailGenreText}</p>
                    <p>Language: {detailBook.language}</p>
                    <p>Description: {detailBook.description}</p>
                    {/* <p>Sold: {detailProduct.sold}</p> */}
                    {
                        
                        isAdmin ?
                        <></>
                        :
                        <>
                        <div>
                        <Link to="/pomodoro" className="cart">
                        Read
                        </Link>
                        <Link to="" className="cart"
                            onClick={handleAdd}
                        >
                        Favorite
                        </Link>
                        </div>
                        <a href={detailBook.sellerUrl} className="seller_url">Buy Now</a>
                        </>
                    }
                    
                </div>
                </div>
                
            </div>
            <div className='sharebutton'>
            <ShareLink link='' >
          {link => (
              <a href={link} target='_blank'>Share this on Facebook</a>
          )}
      </ShareLink>
            </div>
            <h2>Rating: {detailBook.numReviews} reviews</h2>
                <Rating props={detailBook}/>

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

                <FormInput id={params.id} socket={socket} rating={rating} isLogged={isLogged} user={user}/>

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

            <div>
                <h2>By the same author</h2>
                <div className="products">
                    {
                        
                        books.map(book => {
                            return book.author === detailBook.author
                                ? <BookItem key={book._id} book={book} /> : null
                        })
                    }
                </div>
            </div>
            <div>
                <h2>Similar Books</h2>
                <div className="products">
                    {
                        
                        books.map(book => {
                            return findCommonElement(book.genre, detailBook.genre)
                                ? <BookItem key={book._id} book={book} /> : null
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default DetailBook