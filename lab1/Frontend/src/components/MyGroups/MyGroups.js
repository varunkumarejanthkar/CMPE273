import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import {url} from "../Constants"

class MyGroups extends Component {
  constructor() {
    console.log("Inside Account constructor");
    super();
    this.state = {
      user: {}, 
      allGroupDetails: [],
      allExpenseDetails: []   
    };
    
  }   
 
  componentWillMount() {
    console.log("Inside MyGroups componentDidMount : ");    
    this.state.user = JSON.parse(sessionStorage.getItem("user")); 
    console.log(this.state.user);
    axios.get(url + '/GetAllExpensesDetails?userId=' + this.state.user.UserId)
    .then((response) => {
      console.log("respones from GetAllExpensesDetails");
      console.log(response.data);      
      this.setState({
        allExpenseDetails: response.data
      });    
    axios.get(url + '/GetGroupInvitationDetails?UserId=' + this.state.user.UserId)
    .then((response) => {    
        this.setState({
            allGroupInvitationDetails: response.data
        })

        console.log(this.state.allGroupInvitationDetails);

        axios.get(url + '/GetAllGroupsDetails?UserId=' + this.state.user.UserId)
        .then((response) => {             
            this.setState({
            allGroupDetails: response.data
        })
    
        console.log(this.state.allGroupDetails);
        this.renderGroupsDropDown();
        })
        .catch((error) => {
            this.setState({
            authFlag: false,
        });       
        console.log(error);
        alert("Something went wrong");        
        });
    })
    .catch((error) => {
        this.setState({
        authFlag: false,
    });       
        console.log(error);
        alert("Something went wrong");        
    });
    })
    .catch((error) => {
        this.setState({
        authFlag: false,
    });       
    console.log(error);
    alert("Something went wrong");        
    });
  }

  renderGroupsDropDown = () =>{        
    var html = '<select id="dropdownGroups" style = "width:157%; border-Radius: 5px; font-Size: 22px"}>';
    html += '<option value=""></option>';

    for(const obj of this.state.allGroupDetails)
    {      
      html += '<option value="' + obj.GroupName +'">' + obj.GroupName + '</option>';
    }

    html += "</select>";
    console.log(html);    
    document.getElementById("divGroupDropDown").innerHTML = html;
    const groupDiv = document.getElementById("dropdownGroups");
    groupDiv.addEventListener("change", this.onDropDownChange);

    var html2 = "<ul>";
    for(const obj of this.state.allGroupInvitationDetails)
    {
        if(obj.IsInvitationAccepted.data[0] === 0)
        {
            html2 += "<li><button id = 'btn" + obj.GroupName +"' style = 'border:0px; border-radius:5px;margin-top:11%;background:white;color:blue;font-size:20px'>" + obj.GroupName + "</button></li>";           
        }
    }   

    html2 += "</ul>";
    document.getElementById("divInvitations").innerHTML = html2;

    for(const obj of this.state.allGroupInvitationDetails)
    {
        if(obj.IsInvitationAccepted.data[0] === 0)
        {           
            document.getElementById("btn" + obj.GroupName).onclick = this.onclickInvitationButton;
        }
    }  
  }

  onclickInvitationButton = (e) => {
    const groupName = e.srcElement.id.substring(3, e.srcElement.id.length);
    var GroupId = "";
    for(const obj of this.state.allGroupDetails)
    {
        if(obj.GroupName === groupName)
        {            
            GroupId = obj.GroupID;
            break;
        }
    }

    const data = {
        userId : this.state.user.UserId,
        groupId : GroupId
    }
    
    axios.defaults.withCredentials = true;       
        axios.post(url + '/saveInvitation',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log(response.data)
                    this.setState({
                        authFlag : true
                    });
                    //this.props.history.push("/home");
                    alert("Invitation accepted successfully");
                    window.location.reload();
                }else{                    
                    this.setState({
                        authFlag : false
                    })
                    console.log("Inside saveInvitation");
                    alert("Something went wrong");
                }
            },
            )
            .catch(error => {
                console.log(error);
                alert("Something went wrong");    
            });     
  }

  leaveGroup = () => {
    const groupName = document.getElementById("dropdownGroups").value; 
    const userId = this.state.user.UserId; 
    var groupId = "";

    for(const obj of this.state.allGroupDetails)
    {
        if(obj.GroupName === groupName)
        {            
            groupId = obj.GroupID;
            break;
        }
    }       

    for(const obj of this.state.allExpenseDetails)
    {
        if(obj.UserId2 === userId && obj.GroupId === groupId)
        {
            alert("Please clear all the dues");
            return;
        }
    }

    const data = {
        GroupId: groupId,
        UserId: userId
    }
    
    axios.defaults.withCredentials = true;       
    axios.post(url + '/leaveGroup',data)
           .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log(response.data)
                this.setState({
                    authFlag : true
                });
                    //this.props.history.push("/home");
                alert("Left Group successfully");
                window.location.reload();
            }else{                    
                this.setState({
                    authFlag : false
                })
                console.log("Inside leaveGroup");
                alert("Something went wrong");
            }
            })
            .catch(error => {
                console.log(error);
                alert("Something went wrong");    
            });       
  }

  onDropDownChange = () =>
  {   
    const groupDiv = document.getElementById("divGroupLink");
    var html = "<button id = 'btnGroupLink' style = 'border:0px; border-radius:5px;margin-top:11%;background:white;color:blue;font-size:20px'>" + document.getElementById("dropdownGroups").value + "</button>";
    html += "<button id = 'btnLeaveGroup' style = 'border:1px solid; border-radius:5px;margin-top:11%;margin-left:10px;color:red;font-size:20px'>Leave Group</button>"
    groupDiv.innerHTML = html;
    console.log("Inside onDropDownChange");
    document.getElementById("btnGroupLink").addEventListener("click", this.onGroupLinkClicked); 
    document.getElementById("btnLeaveGroup").addEventListener("click", this.leaveGroup); 

  }

  onGroupLinkClicked = () =>
  {
      const groupName = document.getElementById("dropdownGroups").value;
      sessionStorage.setItem("ActiveGroup", groupName);
      this.props.history.push("/groups");
  }

  render() {
    //if not logged in go to login page
    let redirectVar = null;
    console.log("Outside if block cookie.load cookie");
    if (!cookie.load("cookie")) {
      console.log("Inside if block cookie.load cookie");
      redirectVar = <Redirect to="/landing" />;
    }   
    return (
      <div>
        {redirectVar}
        <div style = {{marginLeft: "20%", height: "100vh", marginTop: "-2%"}}>
            <div style = {{marginLeft: "2%", marginTop: "5%", float: "left", width: "21%"}}>
                <a href="/home"><img height="200" width="200" alt = "" class="envelope" src="https://assets.splitwise.com/assets/core/logo-square-65a6124237868b1d2ce2f5db2ab0b7c777e2348b797626816400534116ae22d7.svg"></img></a>
            </div>               
            <div id = "divMyGroups" style = {{marginTop: "7%", float: "left", marginLeft: "5%"}}>
                <div>
                    <label style = {{fontSize: "200%", fontWeight: "100"}}>My Groups</label>
                </div>
                <label style = {{fontWeight: "100"}}> Groups List:</label><br/>   
                <div id = "divGroupDropDown">
                </div>             
                <div id = "divGroupLink">
                </div>                
            </div>
            <div id = "divAcceptInvitation" style = {{ float: "left", marginLeft: "15%", marginTop: "7%", fontSize: "25px"}}>
                Group Invitations
            <div id = "divInvitations"></div>
            </div>  
        </div>
      </div>
    );
  }
}

export default MyGroups;
