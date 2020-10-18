import React from 'react';
import Achievements from '../components/Achievements';
import Footer from '../components/Footer';
import Header from '../components/Header';

function AchievementPage(props){
    return(
        <>
            <Header {...props}/>
            <Achievements {...props}/>
        </>
    )
}

export default AchievementPage;