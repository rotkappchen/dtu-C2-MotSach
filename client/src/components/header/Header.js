import React from "react";
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import axios from 'axios'

function Header(){

    const auth = useSelector(state=>state.auth)

    const {user, isLogged, isAdmin, isEditor}=auth

    const handleLogout = async () => {
        try {
            await axios.get('/api/logout')
            localStorage.removeItem('firstLogin')
            //localStorage.removeItem('list')
            window.location.href = "/";
        } catch (err) {
            window.location.href = "/";
        }
    }
    
    const userLink = () => {
        return <li className="drop-nav">
            <Link to="#" className="avatar">
            <img src={user.avatar} alt=""/> {user.name} <i className="fas fa-angle-down"></i>
            </Link>
            <ul className="dropdown">
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
            </ul>
        </li>
    }

    const transForm ={
        transform: isLogged? "translateY(-5px)" : 0
    }



    return(
        <header>
        <div className="logo">
            <h1><Link to="/"><i class="fas fa-book-reader"></i> Mọt Sách</Link></h1>
        </div>

        <ul stryle={transForm}>
            <li><Link to="/"><i className=""></i>Books</Link></li>
            <li><Link to="/blogs"><i className=""></i>Blogs</Link></li>
            
            {
                isAdmin || isEditor
                ? <li><Link to="/genres"><i className=""></i>Genres</Link></li>
                : <li><Link to="/about"><i className=""></i> About</Link></li>
            }
            {
                isAdmin || isEditor
                ? <li><Link to="/add_book"><i className=""></i>Add Book</Link></li>
                : <></>
            }{
                !isAdmin
                ?<li><Link to="/write"><i className=""></i>Write</Link></li>
                :<></>
            }
            {
                !isAdmin
                ?<>{
                    isLogged ?
                    <li> <Link to="/subscription"><i className=""></i>Donate</Link></li>
                    :
                    <li> <Link to="/login"><i className=""></i>Donate</Link></li>

                } </>
                :<li> <Link to="/history"><i className=""></i>Donators</Link></li>
            }
            {
                isLogged
                ? userLink()
                :<li><Link to="/login"><i className=""></i>Log in</Link></li>
            }
            {
                isLogged
                ? <li></li>
                :<li><Link to="/register"><i className=""></i>Register</Link></li>
            }
        </ul>        
    </header>
    )
}

export default Header