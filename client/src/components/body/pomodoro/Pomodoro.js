import React, { useEffect, useContext } from 'react'
import Button from './Button'
import CountdownAnimation from './CountDownAnimation'
import SetPomodoro from './SetPomodoro'
import { SettingsContext } from './SettingsContext'
import {useSelector} from 'react-redux'
import axios from'axios'
import {useNavigate} from 'react-router-dom'
import alertSound from './alert.mp3'


var countWork =0
var workValue =0

function Pomodoro(){

    const {
        pomodoro,
        executing,
        startAnimate,
        children,
        startTimer,
        pauseTimer,
        updateExecute,
        setCurrentTimer,
        SettingsBtn, stopTimer } = useContext(SettingsContext)

        function playSound(url) {
          const audio = new Audio(url);
          audio.play();
        }
    
        useEffect(() => {
          updateExecute(executing)
          // if(!startAnimate) playSound(alert)
          // console.log("this just in")

        }, [executing, startAnimate])
        const countWorkSession = () =>{
          startTimer()
          executing.active === 'work' ?
          countWork = countWork+1
          : countWork = countWork
          executing.active === 'work' ?
          workValue = pomodoro
          : workValue=workValue
      }

    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const users = useSelector(state => state.users)

    const {user} = auth
    const navigate = useNavigate()

    // const nextLvl = (currentExp, level) => {
    //    //next_lvl()n { return round((4 * (A6 ^ 3)) / 5) }
    //    const pass= false
    //    const passExp= Math.round(4*(level*level*level)/5)
    //    currentExp >= passExp ?
    //    pass=true
    //    : pass=false
    //    return pass
    // }

    const handleSubmit = async()=> {
        try {
            const newExp = user.exp+parseInt(countWork*workValue*10)
            var test =Math.round(4*(user.level*user.level*user.level)/5)
            var newLvl = user.level
            while (newExp>=test) {
                newLvl=newLvl+1
                test =Math.round(4*(newLvl*newLvl*newLvl)/5)
            }
              
            // console.log(newExp)
            // console.log(newLvl)

    
        await axios.patch(`/api/update_level/${user._id}`,{
            exp: newExp, level: newLvl
        }, {
            headers: {Authorization: token}
        })

            // console.log(newExp)
            // console.log(newLvl)

        
        alert("Congratulation! Your level is "+newLvl+" and your exp. is "+newExp)  
        stopTimer()
        
        // navigate('/pomodoro')

        } catch (err) {
            alert(err.response.data.msg)
        }
      }


      // const workValue= 0
      // executing.active === 'work' ?
      // workValue=pomodoro
      // :
      //console.log(workValue)
    
    return (
        <div className="containerPomodoro">
        <h1>Pomodoro</h1>
        <span>Read your books wisely</span>
        {pomodoro !== 0 ?
        <>
          <ul className="labels">
            <li>
              <Button 
                title="Work" 
                activeClass={executing.active === 'work' ? 'active-label' : undefined} 
                _callback={() => setCurrentTimer('work')} 
              />
            </li>
            <li>
              <Button 
                title="Short Break" 
                activeClass={executing.active === 'short' ? 'active-label' : undefined} 
                _callback={() => setCurrentTimer('short')} 
              />
            </li>
            <li>
              <Button 
                title="Long Break" 
                activeClass={executing.active === 'long' ? 'active-label' : undefined} 
                _callback={() => setCurrentTimer('long')} 
              />
            </li>
          </ul>
          <Button title="Settings" _callback={SettingsBtn} />
          <div className="timer-container">
            <div className="time-wrapper">
                <CountdownAnimation
                  key={pomodoro} 
                  timer={pomodoro} 
                  animate={startAnimate}
                >
                  {children}
                </CountdownAnimation>
            </div>
          </div>
          <div className="button-wrapper">
            <Button title="Start" activeClass={!startAnimate ? 'active' : undefined} _callback={countWorkSession} />
            <Button title="Pause" activeClass={startAnimate ? 'active' : undefined} _callback={pauseTimer} />
            <button type='submit' onClick={handleSubmit}>Stop</button>
          </div>
        </> : <SetPomodoro />}
      </div>
    )
}

export default Pomodoro