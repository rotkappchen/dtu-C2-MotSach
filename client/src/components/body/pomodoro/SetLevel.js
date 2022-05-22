import React, { useState, useContext } from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import './pomodoro.css'
import { SettingsContext } from './SettingsContext'
import axios from 'axios'

const SetLevel = (countWork, workValue) => {

    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const users = useSelector(state => state.users)

    const {user} = auth

    const {} = useContext(SettingsContext)
    const navigate = useNavigate()

    const nextLvl = (currentExp, level) => {
       //next_lvl()n { return round((4 * (A6 ^ 3)) / 5) }
       const pass= false
       const passExp= Math.round((4*(level*level*level))/5)
       currentExp >= passExp ?
       pass=true
       : pass=false
       return pass
    }

    const handleSubmit = async()=> {
        try {
            const newExp = user.exp+parseInt(countWork*workValue*10)
            const newLvl = nextLvl(newExp) ? newLvl : newLvl+1
    
        // await axios.patch(`/api/update_level/${user._id}`,{
        //     exp: newExp, level: newLvl
        // }, {
        //     headers: {Authorization: token}
        // })

        console.log(newExp)
        console.log(newLvl)

        alert("Congratulation! Your level is "+newLvl+" and your exp. is "+newExp)  
        navigate.push('/')
        } catch (err) {
            alert(err.response.data.msg)
        }
        
        
    }
    return (
        <div className="form-container">
            <form noValidate>
                <button type='submit' onClick={handleSubmit}>Stop</button>
            </form>
        </div>
    )
}

export default SetLevel
