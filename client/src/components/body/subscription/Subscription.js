import React , {useState}from 'react'
import axios from 'axios'
import PaypalButton from './PaypalButton'
import {useSelector} from 'react-redux'
import '../detailBlog/detailblog.css'
function Subscription(){



    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const users = useSelector(state => state.users)
    const [total, setTotal] = useState(15)

    const tranSuccess = async(payment) => {
        const {paymentID} = payment;

        await axios.post('/api/payment', {paymentID}, {
            headers: {Authorization: token}
        })

        console.log(payment)

        alert("You have successfully donate to MotSach. Thanks to your generosity our website will grow strong and persistent.")
    } 
    const handleChange = e => {
        const total = e.target.value 
        setTotal(total)
    }


    return (
        <div>
            <div className="singlePostInfo">
                <div className='detail0'>
                    <h1>HELP US DO MORE</h1>
                    <p>Your support will help expanding </p>
                    <p>our work and hence the book lover community!</p>
                </div>
                
                <div className="box-detail">
                
                    <input type="text" name="name" id="name" defaultValue={total}
                    placeholder="Your donation" onChange={handleChange} />
                    <label htmlFor="name">  $</label>

                
            <PaypalButton 
            total={total}
            tranSuccess ={tranSuccess}
            />
        </div>
        </div>
        </div>
    )
}

export default Subscription