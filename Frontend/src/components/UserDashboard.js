import React, { Component } from 'react';
import { CircularProgressbar,buildStyles,CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { easeQuadInOut } from 'd3-ease';
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import RadialSeparators from "./RadialSeparators";
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup,Label, Input, FormText
  } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from 'axios';
import {ClientContext} from '../context/clientContext';
import {Caloriesdata} from './Caloriesdata';
import Timer from 'react-compound-timer';
import {AiOutlineCheckCircle} from 'react-icons/ai';
import ReactTimerStopwatch from 'react-stopwatch-timer';
export class UserDashboard extends Component {
    static contextType=ClientContext;
    constructor(props){
        super(props);
        this.state={
            foodData:[],
            calorieDetail:{},
            foodsTaken:[],
            isFoodModalOpen:false,
            isGoalModalOpen:false,
            startDate:new Date(),
            date:moment(new Date()).format("YYYY-MM-DD"),
            totalCalories:0,
            fooditem:'',
            quantity:0,
            userpoints:0,
            goal:'',
            userGoals:[],
            runningtime:0,
            isRunning:false,
            userTime:0,
            timeExist:false,
            timeId:''
        }
    }

     getUserId = async() =>{
        const data = await localStorage.getItem('userId');
         axios.post('/food/get-daily-calories-sum', {
            date:this.state.date,
            userId:data
          })
          .then( (response) => {
           this.setState({
               totalCalories:response.data.total
           })
        
          })
          .catch(function (error) {
            console.log(error);
          });
      }

      getFoodIntake= async() =>{
        const data = await localStorage.getItem('userId');
         axios.post('/food/get-daily-food', {
            date:this.state.date,
            userId:data
          })
          .then( (response) => {
              this.setState({
                  foodsTaken:response.data.foods
              })
         console.log(response.data.foods)
          })
          .catch(function (error) {
            console.log(error);
          });
      }

      getUserPoints=async() =>{
        const data = await localStorage.getItem('userId');
        axios.get('/user/get-specific-user/'+data)
            .then( (response) => {
                this.setState({
                    userpoints:response.data.user.points
                })
               
            })
            .catch(function (error) {
                console.log(error);
            });

      }

      getUserTask=async() =>{
        const data = await localStorage.getItem('userId');
        axios.get('/task/get-user-tasks/'+data)
            .then( (response) => {
                console.log(response.data.tasks)
                this.setState({
                    userGoals:response.data.tasks
                })
              
               
            })
            .catch(function (error) {
                console.log(error);
            });

      }

      getUserTime= async() =>{
        const data = await localStorage.getItem('userId');
         axios.post('/time/get-user-time/'+data, {
            day:this.state.date,
           
          })
          .then( (response) => {
            if (response.data.data.length>0)
            {
                this.setState({
                    userTime:response.data.data[0].total_time,
                    timeExist:true,
                    timeId:response.data.data[0]._id
                })
            }
         console.log(response)
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    componentDidMount=()=>{
       
        this.getUserId();
        this.getFoodIntake();
        this.getUserPoints();
        this.getUserTask();
        this.getUserTime();
        Caloriesdata.map((c)=>{
            const temp={};
            const temp1=this.state.calorieDetail;
           const t=this.state.foodData;
           temp["name"]=c["Food and Serving"];
           temp["calories"]=c["Calories"];
           temp1[c["Food and Serving"]]=c["Calories"];
           t.push(temp);
           this.setState({
               foodData:t,
               calorieDetail:temp1
           })
        })
    }
    handleClock=()=>{
        if (this.state.isRunning)
        {
            clearInterval(this.timerId);
            this.setState({
                isRunning:false
            })
        }
        else{
            const startTime=Date.now() - this.state.runningtime;
            this.timerId=setInterval(() => {
                this.setState({
                    runningtime: Date.now()-startTime,
                    isRunning:true
                })
            }, 100);
        }
    }

    handleReset=async()=>{
        clearInterval(this.timerId);
        if (this.state.timeExist==true)
        {
            const data = await localStorage.getItem('userId');
            axios.put('/time/update-time-for-user/'+this.state.timeId, {
              total_time:parseInt((this.state.userTime)+((this.state.runningtime/1000)/60))
              
             })
             .then( (response) => {
              
            console.log(response)
             })
             .catch(function (error) {
               console.log(error);
             });
        }
        else
        {
            const data = await localStorage.getItem('userId');
            axios.post('/time/create-time-for-user/'+data, {
                day:this.state.date,
                total_time:parseInt(((this.state.runningtime/1000)/60))
              
             })
             .then( (response) => {
              
            console.log(response)
             })
             .catch(function (error) {
               console.log(error);
             });
        }
        this.setState({
            userTime:this.state.userTime+=parseInt(((this.state.runningtime/1000)/60)),
            isRunning:false,
            runningtime:0
            
        })
        
    }
    formatTime=(t)=>{
        return(t/1000).toFixed(1)
    }
    toggleFoodModal=()=>{
        console.log(this.context.userId);
        this.setState({
            isFoodModalOpen:!this.state.isFoodModalOpen
        })
    }
    toggleGoalModal=()=>{
        this.setState({
            isGoalModalOpen:!this.state.isGoalModalOpen
        })
    }
    handleDateChange=(date)=>{
        this.setState({
            startDate:date
        })
    }

    handleInputChange=(event)=>{
        const target=event.target;
        const name=target.name;
        const value=target.value;
        this.setState({
            [name]:value
        })
    }

    onFoodSubmit=()=>{
        axios.post('/food/create-food/'+this.context.userId, {
            foodName:this.state.fooditem,
            calories: (this.state.quantity*this.state.calorieDetail[this.state.fooditem]),
            date:this.state.date
          })
          .then( (response) => {
           const temp=[...this.state.foodsTaken];
           const temp1={
            "foodName":this.state.fooditem,
            "calories": (this.state.quantity*this.state.calorieDetail[this.state.fooditem]),
            "date":this.state.date
           }
           var present=this.state.totalCalories;
           present+=(this.state.quantity*this.state.calorieDetail[this.state.fooditem])
           temp.push(temp1);
           this.setState({
               foodsTaken:temp,
               totalCalories:present
           })
          })
          .catch(function (error) {
            console.log(error);
          });
        //   this.getUserId();
        //   this.getFoodIntake();
          this.toggleFoodModal();
    }

    onGoalSubmit=()=>{
        axios.post('/task/create-task/'+this.context.userId, {
            "heading":this.state.goal,
            "description":"",
            "startDate":this.state.date,
            "endDate":moment(this.state.startDate).format("YYYY-MM-DD"),
            "time":"2020-10-16T06:00:00Z"
          })
          .then( (response) => {
            const temp=[...this.state.userGoals];
            const temp1={
                "heading":this.state.goal,
                "description":"",
                "startDate":this.state.date,
                "endDate":moment(this.state.startDate).format("YYYY-MM-DD"),
                "time":"2020-10-16T06:00:00Z",
                is_completed:false,
                _id:response.data.tasks._id
            };
          
            
            temp.push(temp1);
            this.setState({
                userGoals:temp,
                
            })
          })
          .catch(function (error) {
            console.log(error);
          });
         
          this.toggleGoalModal();
    }

    deleteTask=(event)=>{
        
        const id=event.target.id;
        console.log(id);
        axios.put('/task/mark-task-completed/'+id)
        .then( (response) => {
            const data = [...this.state.userGoals];
            
            console.log(data)
            const index = data.findIndex(
                item => item._id === id
            );
            var presentpts=this.state.userpoints;
            presentpts+=5;

            data.splice(index, 1);
            this.setState({
                userGoals:data,
                userpoints:presentpts
            })
        })
        .catch(function (error) {
          console.log(error);
        });
        // this.getUserTask();
    }
    render() {
        const dropdownoptions=this.state.foodData.map((f)=>{
            return(
                <option>{f.name}</option>
            )
        })

        const foodtable=this.state.foodsTaken.map((f)=>{
            return(
                <tr>
                <td>{f.foodName}</td>
                <td>{f.calories}</td>
                
            </tr>
            )
        })
        
        const goaltable=this.state.userGoals.map((g)=>{
            if (g.is_completed==false)
            {
            return(
                <tr>
                <td>{g.heading}</td>
                <td>{moment(g.endDate).format("DD-MM-YYYY")}</td>
                <td><Button id={g._id} style={{background:'transparent',paddingTop:'0px'}} onClick={this.deleteTask}><AiOutlineCheckCircle  /></Button></td>
            </tr>
            )}
            else{
                return(
                    <div></div>
                )
            }
        })

        const fromTime = new Date(0, 0, 0, 0, 0, 0, 0);
        return (
            <div style={{height:"88vh",paddingTop:30}}>
                 <Modal isOpen={this.state.isFoodModalOpen} toggle={this.toggleFoodModal}>
                    <ModalHeader toggle={this.toggleFoodModal}>Add food</ModalHeader>
                    <ModalBody>
                        <Form>
                        <FormGroup>
                            <Label for="exampleSelect">Food name</Label>
                            <Input type="select" name="fooditem" id="exampleSelect" onChange={this.handleInputChange}>
                            {/* <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option> */}
                            {dropdownoptions}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="quantity">Quantity</Label>
                            <Input type="number" name="quantity" id="" onChange={this.handleInputChange}/>
                        </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{backgroundColor:'#3e98c7',width:'25%',color:'black',display:'block',margin:'auto'}} onClick={this.onFoodSubmit}>Add</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.isGoalModalOpen} toggle={this.toggleGoalModal}>
                    <ModalHeader toggle={this.toggleGoalModal}>Add Goal</ModalHeader>
                    <ModalBody>
                        <Form>
                        <FormGroup>
                            <Label for="exampleText">Goal name</Label>
                            <Input type="text" name="goal" id="exampleText" onChange={this.handleInputChange} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Deadline</Label> <br/>
                            <DatePicker selected={this.state.startDate} onChange={date => this.handleDateChange(date)} />
                        </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{backgroundColor:'#3e98c7',width:'25%',color:'black',display:'block',margin:'auto'}} onClick={this.onGoalSubmit}>Add</Button>
                    </ModalFooter>
                </Modal>
            <div className="container dashhead">
                <h2 className="headings">Dashboard</h2>
                <div className="row">
                    <div className="col-md-4" style={{marginTop:20}}>
                    <AnimatedProgressProvider
                        valueStart={0}
                        valueEnd={(this.state.totalCalories/2500)*100}
                        duration={1.4}
                        easingFunction={easeQuadInOut}
                        >
                        {(value) => {
                            const roundedValue = Math.round(value);
                            return (
                            <CircularProgressbarWithChildren
                                value={value}
                                text={`${this.state.totalCalories}`}
                                /* This is important to include, because if you're fully managing the
                                animation yourself, you'll want to disable the CSS animation. */
                                styles={buildStyles({ pathTransition: 'none',  })}
                            >
                              
                            </CircularProgressbarWithChildren>
                            );
                        }}
                        </AnimatedProgressProvider>;
                        <br/>
                        <h2>Calorie Intake</h2>
                        
                        <br/>
                        <Card className="card1">
                            
                            <CardBody>
                            <CardTitle>Calories intake for today</CardTitle>
                            <Table hover>
                                <tr>
                                    <th>Food</th>
                                    <th>Calories</th>
                                    
                                </tr>
                                 {foodtable}
                                </Table>
                            </CardBody>
                        </Card>
                        <br/>
                        <Button style={{backgroundColor:'#3e98c7',width:'75%',color:'black',display:'block',margin:'auto'}} onClick={this.toggleFoodModal}>Add Food</Button>

                    </div>
                    
                    <div className="col-md-4" style={{marginTop:20}}>
                    <AnimatedProgressProvider
                        valueStart={0}
                        valueEnd={this.state.userpoints}
                        duration={1.4}
                        easingFunction={easeQuadInOut}
                        >
                        {(value) => {
                            const roundedValue = Math.round(value);
                            return (
                            <CircularProgressbarWithChildren
                                value={value}
                                text={`${roundedValue}`}
                                /* This is important to include, because if you're fully managing the
                                animation yourself, you'll want to disable the CSS animation. */
                                styles={buildStyles({ pathTransition: 'none', pathColor:'#ffe02c', textColor:'#ffe02c'  })}
                            >
                                
                            </CircularProgressbarWithChildren>
                            );
                        }}
                        </AnimatedProgressProvider>;
                        <br/>
                        <h2>Points</h2>
                        <br/>
                        <Card className="card2">
                            
                            <CardBody>
                            <CardTitle>Goals to be achieved</CardTitle>
                            <Table hover>
                            <tr>
                                    <th>Goal</th>
                                    <th>Deadline</th>
                                    <th></th>
                                </tr>
                               {goaltable}
                                </Table>
                            </CardBody>
                        </Card>
                        <br/>
                        <Button style={{backgroundColor:'#ffe02c',width:'75%',color:'black',display:'block',margin:'auto'}} onClick={this.toggleGoalModal}>Add Goal</Button>

                    </div>

                    <div className="col-md-4" style={{marginTop:20}}>
                    <AnimatedProgressProvider
                        valueStart={0}
                        valueEnd={this.state.timeExist==true?(this.state.userTime/120)*100:0}
                        duration={1.4}
                        easingFunction={easeQuadInOut}
                        >
                        {(value) => {
                            const roundedValue = Math.round(value);
                            return (
                            <CircularProgressbar
                                value={value}
                                text={`${this.state.timeExist==true?(this.state.userTime):0}`}
                                /* This is important to include, because if you're fully managing the
                                animation yourself, you'll want to disable the CSS animation. */
                                styles={buildStyles({ pathTransition: 'none', pathColor:'#9AB446', textColor:'#9AB446' })}
                            />
                            );
                        }}
                        </AnimatedProgressProvider>;
                        <br/>
                        <h2>Exercise time (min)</h2>
                        <br/>   
                        <Card className="card3">
                            
                            <CardBody>
                            <CardTitle>Start exercising</CardTitle>
                            <Button style={{backgroundColor:'#ffe02c',width:'30%',color:'black',float:'left'}} onClick={this.handleClock}>{this.state.isRunning==false?"Start":"pause"}</Button>
                    <Button style={{backgroundColor:'#ffe02c',width:'30%',color:'black',float:'right'}} onClick={this.handleReset}>End</Button>
                    <br/>
                    <h2>{this.formatTime(this.state.runningtime)}</h2>
                            </CardBody>
                        </Card>
                   
                    </div>
                    
                    </div>
                </div>
                </div>
          
        )
    }
}

export default UserDashboard
