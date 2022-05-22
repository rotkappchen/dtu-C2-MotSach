import React, {useState, useEffect} from 'react'
import axios from 'axios'

function UserAPI(token){

    const [isLogged, setIsLogged]=useState(false)
    const [isAdmin, setIsAdmin]=useState(false)
    const [isEditor, setIsEditor]=useState(false)

    useEffect(()=>{

        if(token){
            const getUser = async () =>{
                try {
                    const res = await axios.get('api/info', {
                        headers: {Authorization: token}
                    })

                    //console.log(res)

                    setIsLogged(true)
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)
                    res.data.role === 2 ? setIsEditor(true) : setIsEditor(false)

                    //setCart(res.data.cart)

                } catch (err) {
                    alert(err.response.data.msg)
                }
            }

            getUser()
            
        }

    }, [token])

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        isEditor: [isEditor, setIsEditor]
    }
}

export default UserAPI