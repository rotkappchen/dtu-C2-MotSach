import React from 'react'
import {Link} from 'react-router-dom'

function About(){
    return (
            <div className="detail">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/34/Il_pomodoro.jpg" alt="" />
                <div className="box-detail">
                    <div className="row">
                        <h2>POMODORO TECHNIQUE</h2>
                    </div>
                    <span>A Description</span>
                    <div className='book_detail'>
                    <p>The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, typically 25 minutes in length, separated by short breaks. Each interval is known as a pomodoro, from the Italian word for tomato, after the tomato-shaped kitchen timer Cirillo used as a university student.

The technique has been widely popularized by apps and websites providing timers and instructions. Closely related to concepts such as timeboxing and iterative and incremental development used in software design, the method has been adopted in pair programming contexts. </p>
                    <h3>HOW TO USE IT?</h3>
                    <p>The original technique has six steps: </p>
                    <p>1. Decide on the task to be done.</p>
                    <p>2. Set the pomodoro timer (typically for 25 minutes).</p>
                    <p>3. Work on the task.</p>
                    <p>4. End work when the timer rings and take a short break (typically 5–10 minutes).</p>
                    <p>5. If you have finished fewer than three pomodoros, go back to Step 2 and repeat until you go through all three pomodoros.</p>
                    <p>6. After three pomodoros are done, take the fourth pomodoro and then take a long break (typically 20 to 30 minutes). Once the long break is finished, return to step 2.</p>
        </div>
        <Link to="/pomodoro" className="seller_url">
                        Start reading
                        </Link>
        </div>
        </div>
    )
}

export default About