import React, { Component } from 'react'
import { Button,Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input, FormTex,Spinner } from 'reactstrap';
import headvector from "../assets/headvector.svg";
import axios from "axios";
import {ClientContext} from '../context/clientContext';
import {GoogleLogin} from 'react-google-login';
import Axios from 'axios';

class LoginModal extends Component {
    static contextType = ClientContext;
    constructor(props)
    {
        super(props);
        this.state={
            email:'',
            password:'',
            loader:false
        }
    }

    handleLogChange=(event)=>{
        const target=event.target;
        const name=target.name;
        const value=target.value;
        this.setState({
           [name]:value
        })
    }

    handleDisabled = ()=>{
        const {email,password} = this.state;
        return email&&password;
    }

    onLogSubmit=async (event)=>{
        event.preventDefault();
        this.setState({loader:true});
        await axios.post('/auth/login', {
            "email":this.state.email,
            "password":this.state.password,
          })
          .then((response) =>{
              this.context.setData(response.data.user);
              localStorage.setItem('token',response.data.token);
              this.context.setToken(response.data.token);
              localStorage.setItem('userId',response.data.userId);
              this.context.setUserId(response.data.userId);
              this.setState({loader:false});
              this.props.history.push('/dashboard');
          })
          .catch(function (error) {
            alert(error);
          });
    }

    responseGoogle = (response) => {
        this.setState({loader:true});
        if(response.tokenObj){
        Axios.post(`/auth/social-login`,{
            token:response.tokenObj.id_token
        }).then((response)=>{
            this.context.setData(response.data.user);
            localStorage.setItem('token',response.data.token);
            this.context.setToken(response.data.token);
            localStorage.setItem('userId',response.data.userId);
            this.context.setUserId(response.data.userId);
            this.setState({loader:false});
            this.props.history.push('/dashboard');
        })
        .catch(function (error) {
            alert(error);
        });
    }
    else {
        this.setState({loader:false})
    }
    }

    render(){
        return(
            <Modal isOpen={this.props.isLogModalOpen} toggle={this.props.toggleLogModal}>
                        <ModalHeader toggle={this.props.toggleLogModal}>Login</ModalHeader>
                        <ModalBody>
                        <Form>
                        <FormGroup>
                            <Label for="exampleEmail">Email</Label>
                            <Input type="email" name="email" id="exampleEmail" placeholder="Enter your email" onChange={this.handleLogChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="examplePassword">Password</Label>
                            <Input type="password" name="password" id="examplePassword" placeholder="Enter your password" onChange={this.handleLogChange} />
                        </FormGroup>
                        </Form>

                        </ModalBody>
                        <ModalFooter>
                         <Button disabled={!this.handleDisabled()} onClick={this.onLogSubmit}>{this.state.loader?<Spinner/>:"Login"}</Button>
                         <GoogleLogin
                            clientId="819492862807-8p1qtpjqp486l6m3qgh77t446dcd2e40.apps.googleusercontent.com"
                            buttonText="Login"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />,
                        </ModalFooter>
            </Modal>
        )
    }
}

export default LoginModal;