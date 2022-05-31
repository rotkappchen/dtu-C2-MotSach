import React, { useContext, useState } from 'react'
import './pomodoro.css'
import { SettingsContext } from './SettingsContext'
import {Link} from 'react-router-dom'


const SetPomodoro = () => {

    const [newTimer, setNewTimer] = useState({
        work: 0.2,
        short: 0.1,
        long: 0.5,
        active: 'work'
    })

    const {updateExecute, initialState} = useContext(SettingsContext)

    const handleChange = input => {
        const {name, value} = input.target
        switch (name) {
            case 'work':
                setNewTimer({
                    ...newTimer,
                    work: value
                })
                break;
            case 'shortBreak':
                setNewTimer({
                    ...newTimer,
                    short: value
                })
                break;
            case 'longBreak':
                setNewTimer({
                    ...newTimer,
                    long: value
                })
                break;
        }
    }
    const handleSubmit = e => {
        e.preventDefault()
        updateExecute(newTimer)
    }
    //console.log(initialState)
    return (
        <div className="form-container">
            <form noValidate onSubmit={handleSubmit}>
            {/* <form noValidate> */}

                <div className="input-wrapper">
                    <div>
                    <span>WORK </span>
                    <input className="input0" type="number" name="work" onChange={handleChange} value={newTimer.work} />
                    <span> minutes</span>
                    </div>
                    <div>
                    <span>SHORT </span>
                    <input className="input0" type="number" name="shortBreak" onChange={handleChange} value={newTimer.short} />
                    <span> minutes</span>
                    </div>
                    <div>
                    <span>LONG </span>
                    <input className="input0" type="number" name="longBreak" onChange={handleChange} value={newTimer.long} />
                    <span> minutes</span>
                    </div>
                </div>
                <button type='submit'>Set Timer</button>
                <Link to={`/about`}><button>What is Pomodoro?</button></Link>
                
            </form>
        </div>
    )
}

export default SetPomodoro
