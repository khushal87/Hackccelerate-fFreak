import React, { useEffect, useState } from 'react';

import './App.css';
import MainComponent from './components/MainComponent';
import {Switch,Route,BrowserRouter} from 'react-router-dom';
import AuthScreen from './pages/AuthScreen';
import DashboardScreen from './pages/DashboardScreen';
import ProfileScreen from './pages/ProfileScreen';
import AchievementPage from './pages/AchievementPage';
import PrivateRoute from './PrivateRoutes';
import {ClientContext} from './context/clientContext';

function App() {
  const [token,setToken] = useState(null);
  const [data,setData] = useState(null);
  const [userId,setUserId] = useState(null);

  const getToken = async() =>{
    let data = await localStorage.getItem('token');
    setToken(data);
  }

  const getUserId=async()=>{
    let data = await localStorage.getItem('userId');
    setUserId(data);
  }

  useEffect(()=>{
    getToken();
    getUserId();
  },[])

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <ClientContext.Provider value={{token,setToken,data,setData,userId,setUserId}}>
            <Route exact path="/" component={AuthScreen}/>
            <PrivateRoute exact path='/dashboard' component={DashboardScreen}/>
            <PrivateRoute exact path="/profile" component={ProfileScreen}/>
            <PrivateRoute exact path="/achievement" component={AchievementPage}/>
          </ClientContext.Provider>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
