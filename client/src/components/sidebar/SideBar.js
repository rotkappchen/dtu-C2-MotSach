import React, {useContext} from 'react'
import { GlobalState } from '../../GlobalState';
import {Sidebar, InputItem, DropdownItem, Icon, Item, Logo, LogoText} from 'react-sidebar-ui'
import 'react-sidebar-ui/dist/index.css';
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'


function SideBar(){

    const state = useContext(GlobalState)
    const [genres] = state.genresAPI.genres
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const users = useSelector(state => state.users)

    const {user, isLogged , isAdmin} = auth

    return (
        <div className='sidebar0'>
      <Sidebar bgColor='black'  isCollapsed={true}>
        {
          isLogged ? 
          <>
          <Logo
          image={user.avatar}/>
        <LogoText>{user.name}</LogoText>
          
          </>
          :
          <>
          <Logo
          image='https://media0.giphy.com/media/xT77Y1T0zY1gR5qe5O/200.gif'/>
        <LogoText>MỌT SÁCH</LogoText>
          </>
          
        }
        {/* <DropdownItem
          values={['First', 'Second', 'Third']}
          bgColor={'black'}>
        </DropdownItem> */}

        <Item bgColor='black' href="/">
          <Icon ><i className="fas fa-home"/></Icon>
          <Link className='sidebar_link' to="/" >Home</Link>
        </Item>
        <Item bgColor='black'>
          <Icon><i className="fas fa-user"/></Icon>
          <Link className='sidebar_link' to="/profile" >Profile</Link>
        </Item>
        <Item bgColor='black'>
          <Icon><i className="fas fa-info"/></Icon>
          <Link className='sidebar_link' to="/about" >About</Link>
        </Item>
        <Item bgColor='black'>
        {
          isAdmin ?
          <>
          <Icon><i className="fas fa-sitemap"/></Icon>
          <Link className='sidebar_link' to="/genres" >Genre</Link>
        
          </>
          :
          <>
          </>

        }
        </Item>
        
        {/* <Item bgColor='black'>
          <Icon><i className="fas fa-sitemap"/></Icon>
          Genre
        </Item>
        <Item bgColor='black'>
        <select name="genre" href="/genres">
                        <option value="">Please select genres</option>
                        {
                            genres.map(genre => (
                                <option value={genre.title} key={genre.title}>
                                    {genre.title}
                                </option>
                            ))
                        }
                    </select>
        </Item>
       
        <InputItem type='text' placeholder={'Search...'}/> */}
      </Sidebar>
    </div>
    )
}

export default SideBar