import React, { Component } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
  import Axios from 'axios';
import { Button } from 'reactstrap';
import moment from 'moment';


export class Achievements extends Component {
    constructor(props){
      super(props);
      this.state={
        height:[],
        weight:[],
        data:{},
        tasks:[]
      }
    }


    getUserId=async()=>{
      let data = await localStorage.getItem('userId');
      Axios.get(`/user/get-specific-user/${data}`).then((result)=>{
          this.setState({height:result.data.user.height,weight:result.data.user.weight,data:result.data.user});
      });
      
      Axios.get(`/task/get-user-tasks/${data}`).then((result)=>{
        const data = result.data.tasks.filter(item=>{
          return item.is_completed===true;
        })
        this.setState({tasks:data});
      });
    }

    componentDidMount(){
        this.getUserId();
    }


    shareHandlerPoints =async()=>{
      const shareData = {
          title: "fFreak Points",
          text: `I have scored ${this.state.data.points}`,
          url: `https://ffreak.herokuapp.com/achievement`,
      }
      try {
          await navigator.share(shareData);
      } catch (err) {
          console.log("Something went wrong");
      }
    }

    shareHandlerTask = async(item)=>{
      const shareData = {
          title: "fFreak Task Completed",
          text: `I have completed the ${item.heading} task with 5 points`,
          url: `https://ffreak.herokuapp.com/achievement`,
      }
      try {
          await navigator.share(shareData);
      } catch (err) {
          console.log("Something went wrong");
      }
    }

    render() {
      const data = this.state.weight? this.state.weight.map((item,index)=>{
        return {name:index+1,weight:item};
      }):[];

      const data1 = this.state.height? this.state.height.map((item,index)=>{
        return {name:index+1,height:item};
      }):[];

      const data2 = [];
      for(let i=0;i<this.state.height.length;i++){
        data2.push({name:i+1,bmi:(this.state.weight[i]/(this.state.height[i]*this.state.height[i])).toPrecision(5)});
      }

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
          <div style={{height:"83vh"}}>
            <h1 style={{textAlign:"center",marginTop:40,marginBottom:40}}>Achievements</h1>
            <div className="container">
            <div className="row">
            <div className="col-5">
              <div>
              <h2 style={{textAlign:"center"}}>Weight</h2>
              <BarChart
                width={330}
                height={200}
                data={data}
                margin={{
                  top: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="weight" stackId="a" fill="#82ca9d" />
              </BarChart>
            </div>

            <div>
              <h2 style={{textAlign:"center"}}>Height</h2>
              <BarChart
                width={330}
                height={200}
                data={data1}
                margin={{
                  top: 20, bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="height" stackId="a" fill="orange" />
              </BarChart>
            </div>
            <div>
              <h2 style={{textAlign:"center"}}>BMI</h2>
              <BarChart
                width={330}
                height={200}
                data={data2}
                margin={{
                  top: 20, bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bmi" stackId="a" fill="#d35792" />
              </BarChart>
            </div>
            </div>
            <div className="col-lg-7 col-md-7 col-sm-12 col-xs-12">
              <div className="user-points">
                  <h4 className="title">Points</h4>
                  <h1 style={{color:badge}} className="mainPoints">{this.state.data.points}</h1>
                  <Button>Share</Button>
              </div>
              <div className="user-points" style={{marginTop:30}}>
                  <h4 className="title">Tasks</h4>
                  <h1 style={{color:badge}} className="mainPoints">{this.state.tasks.length}</h1>
                  {this.state.tasks.map(g=>{
                    return <tr style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <td>{g.heading}</td>
                    <td>{moment(g.endDate).format("DD-MM-YYYY")}</td>
                    <td>
                  <div onClick={this.shareHandlerTask(g)} style={{cursor:"pointer",color:"#ffe02c"}}>Share</div>
                    </td>
                </tr>
                  })}
              </div>
            </div>
          </div>
        </div>
            </div>
        )
    }
}

export default Achievements

