import React, { Component } from 'react'
import { Button } from 'reactstrap';
import headvector from "../assets/headvector.svg";
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';

export class AskLogin extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            isRegModalOpen:false,
            isLogModalOpen:false
        }
    }

    toggleRegModal=()=>{
        this.setState({
          isRegModalOpen:!this.state.isRegModalOpen
        })
    }

    toggleLogModal=()=>{
        this.setState({
          isLogModalOpen:!this.state.isLogModalOpen
        })
    }
    
    render() {
        return (
        <div>
            <div class="container loginhead">
                <div class="row">
                    <div class="col-md-6" style={{marginTop:50}}>
                        <h1 style={{color:"#5bc0de",width:"80%",fontFamily:"Roboto"}}>Explore new way of being Fit</h1>
                        <p style={{fontSize:17,fontFamily:"Roboto"}}>Login/Signup to continue</p>
                        <br/>
                        <Button style={{backgroundColor:'#ffe02c',width:'75%',color:'black'}} onClick={this.toggleLogModal}>Login</Button>
                        <br/>
                        <br/>
                        <Button style={{backgroundColor:'#ffe02c',width:'75%',color:'black'}} onClick={this.toggleRegModal}>Register</Button>
                    </div>
                    <div class="col-md-6" style={{paddingBottom:30,paddingTop:30}}>
                        <img src={headvector}/>
                    </div>
                </div>
            </div>
            <RegisterModal isRegModalOpen={this.state.isRegModalOpen} toggleRegModal={this.toggleRegModal}/>
            <LoginModal {...this.props} isLogModalOpen={this.state.isLogModalOpen} toggleLogModal={this.toggleLogModal}/>
        </div>
        )
    }
}

export default AskLogin
