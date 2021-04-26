import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
//import reducer from "../../js/reducers/index";
//import store from "../../js/store/index";
// import Autocomplete from "react-autocomplete"
//import ReactAutocomplete from "react-autocomplete"
import {url} from "../Constants"
class CreateNewGroup extends Component {
  constructor() {
    console.log("Inside Account constructor");
    super();
    this.state = {
      user: {},
      allUserDetails: [],
      count: 3,    
      UsersList: [],
      MailList: []
    };

    this.saveGroupDetails = this.saveGroupDetails.bind(this);  
    this.renderDynamicGroups = this.renderDynamicGroups.bind(this);     
  }

  saveGroupDetails = (e) => {
    const usernameArray = [], emailArray =[];
    usernameArray.push(this.state.user.UserName);
    emailArray.push(this.state.user.Mail);
    let i = 1;
    while(i <= this.state.count)
    {
        const usernameId = "txtName" + i;
        const mailId = "txtMail" + i;
        usernameArray.push(document.getElementById(usernameId).value);
        emailArray.push(document.getElementById(mailId).value);
        i++;
    }  

    const data = {
      UserId: this.state.user.UserId,
      Groupname: document.getElementById("txtGroupName").value,
      UserNameArray: usernameArray,
      emailArray: emailArray
    };

    if(data.Groupname.trim() === "")
    {
        alert("Please enter valid Group name");
        return;
    }

    const userIdArray = [];   

    for(const name of usernameArray)
    {
        for(const obj of this.state.allUserDetails)
        {
            if(obj.UserName === name)
            {
                userIdArray.push(obj.UserId);
            }
        }
    }

    data.UserIdArray = userIdArray;
    console.log(data);    

    axios.defaults.withCredentials = true;
    axios
      .post(url + "/createNewGroup", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        //if (response.status === 200) {
          this.setState({
            authFlag: true,
          });
         
          alert("Group created successfully");         
        //} 
      })
      .catch((error) => {
        console.log("Error : ", error);
        this.setState({
          authFlag: false,
        });
        alert("GroupName already exists!");
        //alert("Group name already exists");    
        // const groupData = {GroupName: data.Groupname};
        // axios
        // .post("http://localhost:3001/IsGroupCreated", groupData)
        // .then((response) => {
        // console.log("Status Code : ", response.status);        
        //   this.setState({
        //     authFlag: true,
        //   });
         
        //   alert("Group created successfully");         
     
        // })
        // .catch((error) => {
        //     console.log("Error : ", error);
        //     this.setState({
        //     authFlag: false,
        //     });
        //     alert("Group name already exists");        
        // });    
        });      
  };

  
  componentWillMount() {
    console.log("Inside Create NewGroup componentDidMount : ");
    //console.log(store.getState());
    console.log(sessionStorage.getItem("user"));
    this.setState({
      user : JSON.parse(sessionStorage.getItem("user"))
    })
    //this.state.user = JSON.parse(sessionStorage.getItem("user")); 
    axios.get(url + '/createNewGroup')
                .then((response) => {
                  if (response.status === 200) {  
                //update the state with the response data
                console.log("Inside CreateNewGroup axios.get");
                console.log(response.data);
                this.setState({
                    allUserDetails : response.data
                });
                const usersList = [], mailList = [];

                for(const obj of response.data)
                {
                  usersList.push(obj.UserName);
                  mailList.push(obj.Mail);
                }               

                this.setState({
                  UsersList : usersList,
                  MailList : mailList
              });

              console.log(this.state.UsersList);
              console.log(this.state.MailList);

              for(var i = 1; i <= 3; i++)
              {
                document.getElementById("txtName" + i).add(document.createElement('option'), 0);
                document.getElementById("txtMail" + i).add(document.createElement('option'), 0);
                for(var j = 0; j < this.state.UsersList.length; j++)
                {
                  if(this.state.UsersList[j] === this.state.user.UserName)
                    continue;
                  console.log(document.getElementById("txtName" + i));
                  var option = document.createElement('option');
                  option.text = this.state.UsersList[j];
                  document.getElementById("txtName" + i).add(option, j + 1);
                  var option1 = document.createElement('option');
                  option1.text = this.state.MailList[j];
                  document.getElementById("txtMail" + i).add(option1, j + 1);
                }
              }
            }
            else {
              this.setState({
                authFlag: false,
              });
              alert("Something went wrong");
            }
            })
            .catch((error) => {
                this.setState({
                  authFlag: false,
                });
                console.log(error);
                alert("Internal Server Error");        
              });   
  }
  
  componentDidMount(){
    console.log(this.state.UsersList);

    for(var i = 1; i <= this.state.count; i++)
    {
        console.log(document.getElementById("txtName" + i));
        document.getElementById("txtName" + i).options[i-1] = this.state.UsersList[i];
        document.getElementById("txtMail" + i).options[i-1] = this.state.MailList[i];
    }
  }

  UserNameOnChange = (e) => {
    console.log(e.target.id); 
    var str = e.target.id;
    str = str.replace("Name", "Mail");
    //alert(str);   

    var count = 0;

    for(const obj of this.state.UsersList)
    {
      if(obj === e.target.value)
      {
        //alert(str);
        document.getElementById(str).value = this.state.MailList[count];  
        break;
      }
      
      count++;
    }
    //alert(document.getElementById(e.target.value).selectedIndex);
  }

  renderGroupMember = (count) =>
  {
      //return str;
      const textNameId = "txtName" + count;
      const textMailId = "txtMail" + count;
      // var usersHtml = "", mailsHtml = "";
      // //alert(this.state.UsersList);
      // for(const obj of this.state.UsersList)
      // {
      //   usersHtml += "<option value= " + {obj} + ">" + {obj} + "</option>";
      //   //mailsHtml += "<option value= " + {mailsList[count]} + ">" + {obj} + "</option>";        
      // }

      // for(const obj of this.state.MailList)
      // {
      //   mailsHtml += "<option value= " + {obj} + ">" + {obj} + "</option>";
      //   //mailsHtml += "<option value= " + {mailsList[count]} + ">" + {obj} + "</option>";        
      // }

      return(<div>
          <img style = {{height: "26px", width: "26px", borderRadius: "13px", marginRight: "5px"}} alt = "" class="faded" src="https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-grey1-50px.png"></img>          
          {/* <ReactAutocomplete
        items={[
          { id: 'foo', label: 'foo' },
          { id: 'bar', label: 'bar' },
          { id: 'baz', label: 'baz' },
        ]}
        shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value) > -1}
        getItemValue={item => item.label}
        renderItem={(item, highlighted) =>
          <div
            key={item.id}
            style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
          >
            {item.label}
          </div>
        }
        value={this.state.nameValues[]}
        onChange={e => this.setState({ value: e.target.value })}
        onSelect={value => this.setState({ value })}
      /> */}
      <select name="userNames" onChange = {this.UserNameOnChange} id = {textNameId} style = {{width:"160px", borderRadius: "4px", fontSize: "18px"}}>        
        {/* {usersHtml} */}
      </select>
      <select name="mailNames" id = {textMailId} style = {{width:"220px", borderRadius: "4px", fontSize: "18px", marginLeft: "15px"}}>        
        {/* {mailsHtml} */}
      </select>
          {/* <input type = "text" id = {textNameId} placeholder = "Name" style = {{height: "30px", width: "30%", borderRadius: "4px", border: "1px solid #999"}}></input> */}
          {/* <input type = "text" id = {textMailId} placeholder = "Email address (optional)" style = {{height: "30px", marginLeft: "5px", borderRadius: "4px", border: "1px solid #999"}}></input><br/><br/> */}
     </div>)
  }

  renderDynamicGroups = () =>
  {
      // this.setState({
      //   count: this.state.count + 1
      // })
      this.state.count++;
      const count = this.state.count;
      console.log(document.getElementById("divDynamicGroups"));
      if(document.getElementById("divDynamicGroups") != null)
      {
        const textNameId = "txtName" + count;
        const textMailId = "txtMail" + count;
        var userHtml = '<select name="userNames" id = ' + textNameId + ' style = "width:160px; border-radius: 4px; font-size: 18px">';
        userHtml += '<option value = ""></option>';
        var mailHtml = '<select name="mailNames" id = ' + textMailId + ' style = "width:220px; border-radius: 4px; font-size: 18px; margin-left: 15px">';        
        mailHtml += '<option value = ""></option>';

        for(var j = 0; j < this.state.UsersList.length; j++)
        {
          if(this.state.UsersList[j] === this.state.user.UserName)
            continue;

          userHtml += '<option value = "' + this.state.UsersList[j] + '">' + this.state.UsersList[j] + '</option>';
          mailHtml += '<option value = "' + this.state.MailList[j] + '">' + this.state.MailList[j] + '</option>';          
        }

       userHtml += "</select>"; 
       mailHtml += "</select>";

        //const str = '<div><img style = "height: 26px; width: 26px; border-radius: 13px; margin-right: 5px;" alt = "" class="faded" src="https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-grey1-50px.png"></img><input type = "text" id = "' + textNameId +'" placeholder = "Name" style = "height: 30px; width: 30%; border-radius: 4px; border: 1px solid rgb(153, 153, 153);"></input><input type = "text" id = "'+ textMailId + '" placeholder = "Email address (optional)" style = "height: 30px; margin-left: 5px; border-radius: 4px; border: 1px solid rgb(153, 153, 153);"></input><br/><br/></div>';      
        const str = '<div><img style = "height: 26px; width: 26px; border-radius: 13px; margin-right: 5px;" alt = "" class="faded" src="https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-grey1-50px.png"></img>'+ userHtml + mailHtml + '<br/></div>';      

        document.getElementById("divDynamicGroups").innerHTML = document.getElementById("divDynamicGroups").innerHTML + str;
      }
  }

  render(){
    let redirectVar = null;
    if(!cookie.load('cookie')){
        redirectVar = <Redirect to= "/landing"/>
    }

    let groupMembersComponent = this.renderGroupMember(1);
    console.log(groupMembersComponent.html);
    groupMembersComponent += this.renderGroupMember(2);
    groupMembersComponent += this.renderGroupMember(3);

    return(
        <div>
            {redirectVar}
            <div class="container">
                <div style = {{marginLeft: "11%", marginTop: "3%", float: "left", width: "21%"}}>
                    <a href="/home"><img height="200" width="200" alt = "" class="envelope" src="https://assets.splitwise.com/assets/core/logo-square-65a6124237868b1d2ce2f5db2ab0b7c777e2348b797626816400534116ae22d7.svg"></img></a>
                </div>
                <div style = {{marginTop: "3%", float: "left"}}>
                    <label style = {{color: "#999", fontSize: "127%", fontFamily: "monospace"}}> START A NEW GROUP</label><br/>
                    <label style = {{fontSize: "24px", lineHeight: "140%", margin: "16px 0 5px", fontWeight: "100"}}>My group shall be called…</label><br/>
                    <input type = "text" id = "txtGroupName" style = {{fontSize: "32px", height: "42px", borderRadius: "5px", border: "1px solid #cccccc"}}/><br/>
                    <div style = {{marginTop: "6%", borderTop: "1px solid #cccccc", paddingTop: "18px"}}>
                        <label style = {{fontSize: "16px", lineHeight: "20px", color: "#999"}}>GROUP MEMBERS</label><br/>
                        <img style = {{height: "26px", width: "26px", borderRadius: "13px", marginRight: "2px"}} alt = "" src="https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-orange44-50px.png"></img>
                        <label style = {{fontWeight: "100"}}>{this.state.user.UserName}</label><br/>
                        <label style = {{fontWeight: "100"}}>({this.state.user.Mail})</label><br/>                        
                    </div>
                    <div id = "divDynamicGroups">
                        {this.renderGroupMember(1)} 
                        {this.renderGroupMember(2)} 
                        {this.renderGroupMember(3)}                    
                        {/*<img style = {{height: "26px", width: "26px", borderRadius: "13px", marginRight: "5px"}} alt = "" class="faded" src="https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-grey1-50px.png"></img>
                        <input type = "text" id = "txtName1" placeholder = "Name" style = {{height: "30px", width: "30%", borderRadius: "4px", border: "1px solid #999"}}></input>
                        <input type = "text" id = "txtMail1" placeholder = "Email address (optional)" style = {{height: "30px", marginLeft: "5px", borderRadius: "4px", border: "1px solid #999"}}></input><br/><br/>
                        <img style = {{height: "26px", width: "26px", borderRadius: "13px", marginRight: "5px"}} alt = "" class="faded" src="https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-grey1-50px.png"></img>
                        <input type = "text" id = "txtName2" placeholder = "Name" style = {{height: "30px", width: "30%", borderRadius: "4px", border: "1px solid #999"}}></input>
                        <input type = "text" id = "txtMail2" placeholder = "Email address (optional)" style = {{height: "30px", marginLeft: "5px", borderRadius: "4px", border: "1px solid #999"}}></input><br/><br/>
                        <img style = {{height: "26px", width: "26px", borderRadius: "13px", marginRight: "5px"}} alt = "" class="faded" src="https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-grey1-50px.png"></img>
                        <input type = "text" id = "txtName3" placeholder = "Name" style = {{height: "30px", width: "30%", borderRadius: "4px", border: "1px solid #999"}}></input>
    <input type = "text" id = "txtMail3" placeholder = "Email address (optional)" style = {{height: "30px", marginLeft: "5px", borderRadius: "4px", border: "1px solid #999"}}></input>*/}
                    </div>
                    <button style = {{display: "block", background: "white", border: "0px", color: "#005580", margin: "15px 0 10px", fontSize: "13px", lineHeight: "13px"}} class="add_nested_fields" data-association="memberships" onClick={this.renderDynamicGroups}>+ Add a person</button>
                    <button onClick={this.saveGroupDetails} class="btn btn-primary" style={{backgroundColor: "#ff652f", border: "0px", borderRadius: "6px", height: "40px", width: "60px", marginTop: "10px", marginBottom: "5px"}}>Save</button>
                </div>
            </div> 
        </div> 
    )
}
}

export default CreateNewGroup;

