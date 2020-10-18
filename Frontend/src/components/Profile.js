import Axios from 'axios';
import React, { Component } from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Table, Badge, Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input, FormText
  } from 'reactstrap';
import { ClientContext } from '../context/clientContext';
import axios from 'axios';  

export class Profile extends Component {
    static contextType = ClientContext;
    constructor(props){
        super(props);
        this.state={
            data:{},
            weight:[],
            height:[],
            isModalOpen:false,
            updatedheight:'',
            updatedweight:'',
            updatedage:''
        }
    }

    getUserId=async()=>{
        let data = await localStorage.getItem('userId');
        Axios.get(`/user/get-specific-user/${data}`).then((result)=>{
            console.log(result.data.user)
            this.setState({data:result.data.user,height:result.data.user.height,weight:result.data.user.weight});
        })
    }

    componentDidMount(){
        this.getUserId();
    }

    toggleModal=()=>{
        this.setState({
            isModalOpen:!this.state.isModalOpen
        })
    }
    onchange=(event)=>{
        const target=event.target;
        const name=target.name;
        const value=target.value;
        console.log(name)
        this.setState({
            [name]:value
        })
    }

    onSubmit=()=>{
        const temp={};
        if (this.state.updatedheight!='')
        {
            temp["height"]=this.state.updatedheight
        }
        if (this.state.updatedweight!='')
        {
            temp["weight"]=this.state.updatedweight
        }
        if (this.state.updatedage!='')
        {
            temp["age"]=this.state.updatedage
        }
        

        axios.put('/user/update-user/'+this.context.userId,temp)
          .then(function (response) {
            console.log(response);
            
          })
          .catch(function (error) {
            console.log(error);
          });
          this.toggleModal();
         
    }
    render() {
        let badge;
        if(this.state.data.points<=10){
            badge="primary"
        } else if(this.state.data.points>=10&&this.state.data.points<=30){
            badge="info"
        }
        else if(this.state.data.points>=31&&this.state.data.points<=60) {
            badge="success"
        }
        else if(this.state.data.points>=60&&this.state.data.points<=85) {
            badge="warning"
        } else {
            badge="danger"
        }
        return (
            <div style={{height:"88vh",paddingTop:30}}>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal} >
                    <ModalHeader toggle={this.toggleModal}>Update Profile</ModalHeader>
                    <ModalBody>
                        <Form>
                        <FormGroup>
                            <Label for="exampleText">New weight</Label>
                            <Input type="text" name="updatedweight" id="exampleText" onChange={this.onchange} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleText">New height</Label>
                            <Input type="text" name="updatedheight" id="exampleText" onChange={this.onchange}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="exampleText">New age</Label>
                            <Input type="text" name="updatedage" id="exampleText" onChange={this.onchange}/>
                        </FormGroup>
                        </Form>
                        
                    </ModalBody>
                    <ModalFooter>
                    {/* <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button> */}
                    <Button onClick={this.onSubmit}>Update</Button>
                    </ModalFooter>
                </Modal>
                <div className="container profile">
                    <h1 className="headings">Profile</h1>
                    <img src={require('../assets/dummy.jpg')} style={{borderRadius:50,height:100,width:100,display:"block",marginLeft:"auto",marginRight:"auto",marginBottom:10}}/>
                    <h6 className="prof-name">{this.state.data.name}</h6>
                    <h6 className="prof-email">{this.state.data.email}</h6>
                    <h6 className="prof-email">Age - {this.state.data.age}</h6>
        <h6 className="prof-email">Points - <Badge color={badge}>{this.state.data.points}</Badge></h6>
        <Button style={{backgroundColor:'#3e98c7',color:'black',display:'block',margin:'auto'}} onClick={this.toggleModal}>Update Profile</Button>
                    <div className="row">
                        <div className="col-md-6">
                        <Card>
                            <CardBody>
                            <CardTitle style={{color:"#ffe02c",fontSize:20,fontWeight:"bold"}}>Starting Weight</CardTitle>
                            <hr/>
                            <h2>{this.state.weight[0]} Kgs</h2>
                            
                            </CardBody>
                        </Card>
                        </div>
                        <div className="col-md-6">
                        <Card>
                            <CardBody>
                            <CardTitle style={{color:"#ffe02c",fontSize:20,fontWeight:"bold"}}>Current Weight</CardTitle>
                            <hr/>
                            <h2>{this.state.weight[this.state.weight.length-1]} Kgs</h2>
                            
                            </CardBody>
                        </Card>
                        </div>
                        <div className="col-md-6">
                        <Card>
                            <CardBody>
                            <CardTitle style={{color:"#ffe02c",fontSize:20,fontWeight:"bold"}}>Height</CardTitle>
                            <hr/>
                            <h2>{this.state.height[0]} feet</h2>
                            
                            </CardBody>
                        </Card>
                        </div>
                        <div className="col-md-6">
                        <Card>
                            <CardBody>
                            <CardTitle style={{color:"#ffe02c",fontSize:20,fontWeight:"bold"}}>BMI</CardTitle>
                            <hr/>
                            <h2>{(this.state.weight[0]/(this.state.height[0]*this.state.height[0])).toPrecision(4)}</h2>
                            
                            </CardBody>
                        </Card>
                        </div>
                    </div>

                    <Table >
                    {/* <tbody>
                        <tr>
                        <th scope="row">1</th>
                        <td>Name</td>
                        <td>Otto</td>
                        </tr>
                        <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                        </tr>
                        <tr>
                        <th scope="row">3</th>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>@twitter</td>
                        </tr>
                        <tr>
                        <th scope="row">3</th>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>@twitter</td>
                        </tr>
                        
                    </tbody> */}
                    
                    </Table>
                </div>
            </div>
        )
    }
}

export default Profile
