import Axios from 'axios';
import React, { Component } from 'react';
import { Button,Modal, ModalHeader, ModalBody, ModalFooter,Form, FormGroup, Label, Input, FormTex,Spinner,Badge,ListGroup,ListGroupItem,ListGroupItemHeading,ListGroupItemText } from 'reactstrap';

class NotificationModal extends Component {
    constructor(props){
        super(props);
        this.state={
            data:[]
        }
    }

    getUserId=async()=>{
        let data = await localStorage.getItem('userId');
        Axios.get(`/task/get-user-tasks/${data}`).then((result)=>{
            this.setState({data:result.data.tasks.filter(item=> item.is_completed===false)})
        })
    }

    componentDidMount(){
        this.getUserId();
    }

    render(){
        return(
            <Modal isOpen={this.props.isNotModalOpen} toggle={this.props.toggleNotModal}>
                <ModalHeader toggle={this.props.toggleNotModal}>Notifications{" "}<Badge color="secondary">{this.props.data.length}</Badge></ModalHeader>
                <ModalBody>
                    
                    <ListGroup>
                    {this.state.data.length>0?<ListGroupItem color="danger">
        <ListGroupItemHeading>{`You have pending tasks to complete`}</ListGroupItemHeading>
      </ListGroupItem>
                    :null}
                    {   
                        this.props.data.map(item=>{
                            return <ListGroupItem>
        <ListGroupItemHeading>{`${item.actor.name} has completed a ${item.operation}`}</ListGroupItemHeading>
      </ListGroupItem>
                        })
                    }
                    </ListGroup>
                </ModalBody>
            </Modal>
        )
    }
}

export default NotificationModal;