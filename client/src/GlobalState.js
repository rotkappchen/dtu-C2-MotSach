import React, {createContext, useState, useEffect} from 'react'
import BooksAPI from './api/BooksAPI'
import GenresAPI from './api/GenresAPI'
import UserAPI from './api/UserAPI'
import BlogsAPI from './api/BlogsAPI'
import axios from 'axios'
import io from 'socket.io-client'

export const GlobalState = createContext()


export const DataProvider = ({children})=>{

    const[token, setToken] = useState(false)
    const[socket, setSocket] = useState(null)



    useEffect(() =>{
        const firstLogin = localStorage.getItem('firstLogin')
        if(firstLogin){
            const refreshToken = async () =>{
                const res = await axios.post('/api/refresh_token')
        
                setToken(res.data.accesstoken)
    
                setTimeout(() => {
                    refreshToken()
                }, 10 * 60 * 1000)
            }
            refreshToken()
        }
        
        const socket = io("http://localhost:3000")
        setSocket(socket)
        return ()=> socket.close()
    },[])

    const state={
        token: [token, setToken],
        booksAPI: BooksAPI(),
        blogsAPI: BlogsAPI(),
        genresAPI: GenresAPI(),
        socket,
        userAPI: UserAPI(token)
    }

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )
}