import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import {url} from "../Constants"
import Pagination from '@material-ui/lab/Pagination';


class RecentActivity extends Component {
  constructor() {
    console.log("Inside Account constructor");
    super();
    this.state = {
      user: {},
      RecentActivityList: "",
      allGroupDetails: [],
      allExpenseDetails:[],
      allUserDetails: [],
      months: [ "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December" ],
      reverse: true,
      pageCount: 0,
      displayActivityCount: 2,
      activitiyDetailsArray: []
    };
    this.changeSortDropDown = this.changeSortDropDown.bind(this);
    this.changePageCount = this.changePageCount.bind(this);
    this.onPageClick = this.onPageClick.bind(this);
  }  

  componentWillMount() {
    console.log("Inside RecentActivity componentDidMount : ");    
    this.state.user = JSON.parse(sessionStorage.getItem("user")); 
    console.log(this.state.user);
    axios.get(url + '/GetAllGroupsDetails?UserId=' + this.state.user.UserId)
    .then((response) => {
                //update the state with the response data
      console.log("Inside GetAllGroupsDetails axios.get");
    //   this.setState({
    //     activeGroup: response.data[0].GroupName,
    //     activeGroupId: response.data[0].GroupID
    //   });
      this.setState({
        allGroupDetails: response.data
      })
    
      console.log(this.state.allGroupDetails);
      if(this.state.allGroupDetails !== '') 
      {
        console.log("Inside allGroupDetails axios.get");
        const groupIdArray = [];
        for(const group of this.state.allGroupDetails)
        {
          groupIdArray.push(group.GroupID);
        }
        axios.get(url + '/GetAllExpensesDetails?userId=' + this.state.user.UserId)
        .then((response) => {
          console.log("respones from GetAllExpensesDetails");
          console.log(response.data);          
          this.setState({
            allExpenseDetails: response.data
          });    
          
          axios.get(url + '/createNewGroup')
                .then((response) => {
                //update the state with the response data
                console.log("Inside CreateNewGroup axios.get");
                console.log(response.data);
                this.setState({
                    allUserDetails : response.data
                });
                axios.get(url + '/getRecentActivityDetails?UserId=' + this.state.user.UserId)
                .then((response) =>{
                  console.log("Inside getRecentActivityDetails axios.get");
                  console.log(response.data);
                  if(response.data.length > 0)
                  {
                    this.setState({
                      recentActivities : response.data[0].activity
                    });
                  }
                this.renderRecentActivities();
                })
            })
            .catch((error) => {
                this.setState({
                  authFlag: false,
                });
                console.log(error)
                alert("Something went wrong");        
              });   
          //this.onRefreshPage();
        })
        .catch((error) => {
          this.setState({
          authFlag: false,
        });
        console.log(error);
        alert("Something went wrong");        
        }); 
      }                     
    })
    .catch((error) => {
      this.setState({
      authFlag: false,
    });   
    console.log(error);
    alert("Something went wrong");        
  });
  }

   renderRecentActivities = () =>{        
  //   const currentUserDetails = [];
    
  //   for(const obj of this.state.allExpenseDetails)
  //   {      
  //     if(obj.UserId === this.state.user.UserId || obj.UserId2 === this.state.user.UserId)
  //     {
  //       currentUserDetails.push(obj);       
  //     }
  //   }
  //   // const currentActiveGroupDetails = this.state.allExpenseDetails.filter(function (e) {
  //   //     return (e.GroupId) === activeGroupId;
  //   // });
  //   currentUserDetails.reverse();
  //   console.log(currentUserDetails);    
  //   var html = "<div style = 'margin-left:4px;'>";
  //   const arr = [];
  //   for(const obj of currentUserDetails)
  //   {       
  //     if(arr.includes(obj.ExpenseDescription))
  //     {
  //       continue;
  //     }
  //     else{
  //       arr.push(obj.ExpenseDescription);
  //     }
  //      console.log(obj.CreatedTime); 
  //      var date = obj.CreatedTime.split("-");
  //      const month = this.state.months[date[1] - 1];
  //      const year = date[0];       
  //      const grpName = this.getGroupName(obj.GroupId);
  //      const expense = obj.Expense * this.getGroupSize(grpName);
  //      const UserName = this.getUserName(obj.UserId);
  //      const User = UserName;
  //      const description = obj.ExpenseDescription;
  //      html += "<img alt = '' style = 'width: 30px' src = 'https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/food-and-drink/groceries@2x.png'></img>"
  //      html+= User + " added \"" + description + "\" in " + grpName + " of amount USD " + expense + " on " + month + " " + date[1];
  //   //    html += "</div><div><label class = 'lblMonth' style='margin-left: 110px;'>" + User + "</label>";

  //   //    html += "<div style = 'float: left; width: 250px'><label class = 'lblMonth' style = 'margin-left: 5px;margin-right: 5px;font-weight: 100; color: #777272'>" + month + "" + year + "</label>";
  //   //    //html += "<label class = 'lblYear' style = 'font-weight: 100; color: #777272'>" + year + "</label>";
  //   //    html += "<img alt = '' style = 'width: 30px' src = 'https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/food-and-drink/groceries@2x.png'></img>"
  //   //    html += "<label style = 'margin-left: 12px' class = 'lblDescription'>" + description + "</label>";       
  //     // html += "<label class = 'lblExpense'>" + expense + "</label></div>";
  //      html += "<br/><br/>";
  //   }

  //   html += "</div>";
  //   console.log("html : " + html);
  //   console.log(document.getElementById("divExpenses"));  
    var text = this.state.recentActivities;
    text = text.replaceAll(this.state.user.UserName, 'You');          
    text = text.split(';');   
    text.shift();
    this.setState({
      activitiyDetailsArray: text
    });
    //text = text.replace(this.state.UserName, 'You');   
    if(this.state.reverse === true)
    {
      text = text.reverse();
    }

    var html = "";
    var count = 1;

    for(var obj of text)
    {
      html += obj + "<br/><br/>";
      count++;
      if(count > this.state.displayActivityCount)
      {
        break;
      }
    }

    var PageCount = Math.floor(text.length / this.state.displayActivityCount);

    if(text.length % this.state.displayActivityCount != 0)
    {
      PageCount++;
    }

    this.setState({
      pageCount: PageCount
    })
      //text[text.length - 1] = '';
    text = text.join('\n<br/><br/>');
    document.getElementById("divRecentActivity").innerHTML = "<br/>" + html;   
  }

    getUserName = (UserId) => {
        for(const user of this.state.allUserDetails)
        {
            if(UserId === user.UserId)
                return user.UserName;
        }
    }

    getGroupName = (groupId) => {      
        for(const group of this.state.allGroupDetails)
        {
            if(groupId === group.GroupID)
                return group.GroupName;
        }
    }

    getGroupSize = (groupName) =>
    {
        console.log("getGroupSize : " + groupName)
        for(const group of this.state.allGroupDetails)
        {
            if(group.GroupName === groupName)
            {               
                return group.GroupSize;
            }     
        }
    }

    changePageCount = (e) => {
      
      const count = document.getElementById("pageCountDropDown").value;
      this.state.displayActivityCount = count;
      this.renderRecentActivities();
    }

    changeSortDropDown = (e) => {
      if(document.getElementById("sortDropDown").value === "MostRecentFirst")
      {
        this.state.reverse = true;
      }
      else
      {
        this.state.reverse = false;
      }
      
      this.renderRecentActivities();
    }

    onPageClick = (e) => {
      const arr = this.state.activitiyDetailsArray;
      const noOfActivities = document.getElementById("pageCountDropDown").value;
      const startValue = noOfActivities * (e.target.innerText - 1);
      const endValue = noOfActivities * (e.target.innerText);
      var html = "<br/>";
      for(let i = startValue; i < endValue; i++)
      {
        if(arr[i] === undefined)
        {
          break;
        }
        html += arr[i] + "<br/><br/>";
      }
      
      document.getElementById("divRecentActivity").innerHTML = html;
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
        <div style = {{marginLeft: "20%", borderLeft: "1px solid #ddd", height: "100vh", marginTop: "-2%"}}>
            <div style = {{borderBottom: "1px solid #ddd", background: "#ddd"}}>
                <label style = {{fontSize: "25px", marginTop: "2%", marginLeft: "1%"}}>Recent activity</label>
            </div>
            
            <label style = {{fontWeight: "100", marginLeft: ".5%"}}>Activities per page : </label>
            <select name="pageCountDropDown" onChange = {this.changePageCount} id="pageCountDropDown" style = {{background: "rgb(232 234 246)", height:"30px", width : "4%", borderRadius: "4px",marginLeft:"1%", marginTop:".5%"}}>
              <option value="2">2</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
            <select name="sortDropDown" onChange = {this.changeSortDropDown} id="sortDropDown" style = {{background: "rgb(232 234 246)", height:"30px", width : "140px", borderRadius: "4px", marginTop:".5%",marginLeft:"2%"}}>
              <option value="MostRecentFirst">Most Recent First</option>
              <option value="MostRecentLast">Most Recent Last</option>
            </select>
            <div id = "divRecentActivity">                
            </div>
            <Pagination id = "divPagination" count={this.state.pageCount} color="primary" variant="outlined" shape="rounded" onClick = {this.onPageClick}/>
        </div>
      </div>
    );
  }
}

export default RecentActivity;
