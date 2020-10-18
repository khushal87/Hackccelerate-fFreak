import React, { Component } from 'react'
import { Button,Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input, FormTex,Spinner } from 'reactstrap';
import headvector from "../assets/headvector.svg";
import axios from "axios";

class RegisterModal extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            name:'',
            email:'',
            password:'',
            gender:'',
            age:'',
            weight:'',
            height:'',
            loader:false
        }
    }

    handleRegChange=(event)=>{
        const target=event.target;
        const name=target.name;
        const value=target.value;
        if (name=="gender")
        {
            const id=target.id;
            this.setState({
                gender:id
            })
        }
        else
        {
            this.setState({
                [name]:value
            })
        }
    }


    handleDisabled = ()=>{
        const {name,email,password,gender,age,height,weight} = this.state;
        return name&&email&&password&&gender&&age&&height&&weight;
    }

    onRegSubmit=async (event)=>{
        event.preventDefault();
        this.setState({loader:true});
        await axios.post('/auth/create-user', {
            "name":this.state.name,
            "email":this.state.email,
            "password":this.state.password,
            "gender":this.state.gender,
            "age":this.state.age,
            "height": this.state.height,
            "weight": this.state.weight
          })
          .then( (response) => {
            this.setState({loader:false});
            alert(response.data.message);
          })
          .catch( (error) => {
            this.setState({loader:false});
            alert(error.response.data.error);
          });
          this.props.toggleRegModal();

    }

    render(){
        return(
            <Modal isOpen={this.props.isRegModalOpen} toggle={this.props.toggleRegModal}>
                        <ModalHeader toggle={this.props.toggleRegModal}>Register</ModalHeader>
                        <ModalBody>
                        <Form>
                        <FormGroup>
                            <Label for="exampleText">Name</Label>
                            <Input type="text" name="name" id="exampleText" placeholder="Enter your name" onChange={this.handleRegChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleEmail">Email</Label>
                            <Input type="email" name="email" id="exampleEmail" placeholder="Enter your email" onChange={this.handleRegChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="examplePassword">Password</Label>
                            <Input type="password" name="password" id="examplePassword" placeholder="Enter your password" onChange={this.handleRegChange} />
                        </FormGroup>
                        <FormGroup tag="fieldset">
                            <legend>Gender</legend>
                            <FormGroup check>
                            <Label check>
                                <Input type="radio" name="gender" id="M" onChange={this.handleRegChange} />{' '}
                               Male
                            </Label>
                            </FormGroup>
                            <FormGroup check>
                            <Label check>
                                <Input type="radio" name="gender" id="F" onChange={this.handleRegChange} />{' '}
                               Female
                            </Label>
                            </FormGroup>
                            <FormGroup check>
                            <Label check>
                                <Input type="radio" name="gender" id="O" onChange={this.handleRegChange} />{' '}
                               Other
                            </Label>
                            </FormGroup>
                            </FormGroup>
                            <FormGroup>
                            <Label for="exampleText">Age</Label>
                            <Input type="text" name="age" id="exampleText" placeholder="Enter your Age" onChange={this.handleRegChange} />
                        </FormGroup> <FormGroup>
                            <Label for="exampleText">Weight (kgs)</Label>
                            <Input type="text" name="weight" id="exampleText" placeholder="Enter your Weight" onChange={this.handleRegChange} />
                        </FormGroup> <FormGroup>
                            <Label for="exampleText">Height (feet)</Label>
                            <Input type="text" name="height" id="exampleText" placeholder="Enter your Height" onChange={this.handleRegChange} />
                        </FormGroup>
                        </Form>

                        </ModalBody>
                        <ModalFooter>
                         <Button disabled={!this.handleDisabled()} onClick={this.onRegSubmit}>{this.state.loader?<Spinner/>:"Register"} </Button>
                        </ModalFooter>
                  </Modal>
        )
    }
}

export default RegisterModal;