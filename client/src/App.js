import React, {useEffect} from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import {DataProvider} from './GlobalState'

import Header from './components/header/Header'
import Body from './components/body/Body'
import Footer from './components/footer/Footer';
import axios from 'axios';
import {dispatchLogin, dispatchGetUser, fetchUser} from './redux/actions/authAction'
//import './App.css';

function App() {
const dispatch=useDispatch()
const token = useSelector(state=> state.token)
const auth = useSelector(state=>state.auth)

useEffect(() => {
  const firstLogin = localStorage.getItem('firstLogin')
  if(firstLogin){
    const getToken = async () => {
      const res = await axios.post('api/refresh_token', null)
      dispatch({type: 'GET_TOKEN', payload: res.data.access_token})
    }
    getToken()
  }
},[auth.isLogged, dispatch])

useEffect(() => {
  if(token){
    const getUser = () => {
      dispatch(dispatchLogin())

      return fetchUser(token).then(res => {
        dispatch(dispatchGetUser(res))
      })
    }
    getUser()
  }
},[token, dispatch])

  return (
    <DataProvider>
    <Router>
    <div className="App">
      <Header />
      <Body  />
      <Footer />
    </div>
    </Router>
    </DataProvider>
  );
}

export default App;
