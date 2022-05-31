import React, {useEffect, useState} from 'react'
import {GlobalState} from '../../../GlobalState'
import {Link} from 'react-router-dom'
import axios from 'axios'
import {useSelector} from 'react-redux'
import './history.css'
import moment from 'moment'

function History() {

    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const users = useSelector(state => state.users)

    const {user, isAdmin} = auth

    const [history, setHistory] = useState([])

    function endDate(date) {
     
        const d = new Date()
        d.setDate((date.getDate() + 30))
        console.log(d)
        return d.toLocaleDateString()
        
        }
    

    useEffect(() => {
        if(token){
            const getHistory = async() =>{
                if(isAdmin){
                    const res = await axios.get('/api/payment', {
                        headers: {Authorization: token}
                    })
                    setHistory(res.data)
                }
            }
            getHistory()
        }
    },[token, isAdmin, setHistory])

    return (
        <div className="history-page">
            <h2>DONORS</h2>
            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Payment ID</th>
                        <th>Date of Subscription</th>
                        {/* <th>End Subscription on...</th> */}

                    </tr>
                </thead>
                <tbody>
                    {
                        history.map(items => (
                            <tr key={items._id}>
                                <td>{items.user_id}</td>
                                <td>{items.name}</td>
                                <td>{items.email}</td>
                                <td>{items.paymentID}</td>
                                <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                                {/* <td>{endDate(new Date(items.createdAt))}</td> */}

                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default History
