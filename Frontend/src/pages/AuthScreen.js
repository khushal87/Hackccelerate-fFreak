import React from 'react'
import AskLogin from '../components/AskLogin';
import Footer from '../components/Footer';
import Header from '../components/Header';

function AuthScreen(props){
    return (
        <>
            <Header {...props}/>
            <AskLogin {...props}/>
        </>
    )
}

export default AuthScreen;