import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import UserDashboard from '../components/UserDashboard';

function DashboardScreen(props){
    return(
        <>
            <Header {...props}/>
            <UserDashboard {...props}/>
        </>
    )
}

export default DashboardScreen;