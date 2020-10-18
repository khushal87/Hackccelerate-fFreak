import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Profile from '../components/Profile';

function ProfileScreen(props){
    return (
        <>
            <Header {...props}/>
            <Profile {...props}/>
        </>
    )
}

export default ProfileScreen;