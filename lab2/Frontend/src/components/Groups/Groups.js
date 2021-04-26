import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import moment from "moment";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../../App.css';
import {url} from "../Constants";
import 'font-awesome/css/font-awesome.min.css';
//import '../../../node_modules/font-awesome/css/font-awesome.min.css';

class Groups extends Component {
  constructor() {
    console.log("Inside Account constructor");
    super();
    this.state = {
      user: {},
      allGroupDetails: [],
      activeGroup: "", 
      activeGroupId: "",
      activeGroupSize: "",
      allExpenseDetails: "",
      activeExpense: "",
      expenseComments: [],
      months: [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ],
    };

    this.saveUserDetails = this.saveUserDetails.bind(this);   
    this.renderGroupExpensesOnclick = this.renderGroupExpensesOnclick.bind(this);
    this.renderExpenseCommensts = this.renderExpenseCommensts.bind(this);
    this.deleteExpenseComment = this.deleteExpenseComment.bind(this);
  }
  
  saveUserDetails = (e) => {
    const data = {
      UserId: this.state.user.UserId,
      UserName: document.getElementById("txtName").value,
      Password: document.getElementById("txtPassword").value,
      Mail: document.getElementById("txtEmail").value,
      Phone_Number: document.getElementById("txtPhn").value,
      DefaultCurrency: document.getElementById("txtCurrency").value,
      Language: document.getElementById("txtLanguage").value
    };

    console.log(data);
    if (!this.validateInputData(data)) {
      alert("Please enter valid input data");
      return;
    }

    if (!this.validateEmail(data.Mail)) {
      alert("Please enter valid email format");
      return;
    }

    axios.defaults.withCredentials = true;
    axios
      .post(url + "/account", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.setState({
            authFlag: true,
          });

          sessionStorage.setItem("user", JSON.stringify(data));
          alert("User data saved successfully");
          //this.props.loginAction(response.data);

          //console.log("Data from login app.post : " + response.data.UserName);
        } else {
          this.setState({
            authFlag: false,
          });
          alert("500 : Internal Server Error");
        }
      })
      .catch((error) => {
        this.setState({
          authFlag: false,
        });

        //alert("Inavalid Credentials");
        //console.log("Error");
      });
  };

  componentDidMount(){
    // console.log("from componentDidMount : ");
    // console.log(document.getElementById("divSideNav"));
    // console.log(this.createMarkup());
    // document.getElementById("divSideNav").innerHTML = this.createMarkup();
  }
  //get the books data from backend
  componentWillMount() {        
    // this.setState({
    //   user : JSON.parse(sessionStorage.getItem("user"))
    // });
    this.state.user = JSON.parse(sessionStorage.getItem("user")); 
    console.log(this.state.user);
    axios.get(url + '/GetAllGroupsDetails?UserId=' + this.state.user.UserId)
    .then((response) => {
                //update the state with the response data
      console.log("Inside GetAllGroupsDetails axios.get");
      if(response.data.length !== 0)
      {
      this.setState({
        activeGroup: response.data[0].GroupName,
        activeGroupId: response.data[0].GroupID
      });
      this.setState({
        allGroupDetails: response.data
      })
    }
      document.getElementById("divSideNav").innerHTML = this.createMarkup();  
      for(const group of this.state.allGroupDetails)
      {
        document.getElementById("btn" + group.GroupName).onclick = this.renderGroupExpensesOnclick;    
      }
      // var buttons = document.getElementsByTagName('button');
      // for (let i = 0; i < buttons.length; i++) {
      //   let button = buttons[i];
      //   console.log(button);
      //   //button.onclick(this.renderGroupExpenses);    
    
      // }
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
          for(const obj of response.data)
          {
            if(obj.ExpenseComments !== '' && obj.ExpenseComments !== null)
            {
              this.state.expenseComments[obj.ExpenseDescription] = obj.ExpenseComments;
            }
          }
          this.renderGroupExpenses(response.data);
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
                this.setState({
                  activeGroup : sessionStorage.getItem('ActiveGroup')
                });
                this.setActiveGroupId();
                this.onRefreshPage();
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

setActiveGroupId = () =>
{
  for(const group of this.state.allGroupDetails)
    {
      if(group.GroupName === this.state.activeGroup)
        {
          this.setState({
            activeGroupId: group.GroupID,
            activeGroupSize: group.GroupSize
          });          
        }     
    }
}
renderGroupExpenses = (data) =>
{
  this.setActiveGroupId();   
}

renderGroupExpensesOnclick = (e) =>
{
  const groupName = e.srcElement.id.substring(3, e.srcElement.id.length);
  this.setState({
    activeGroup: groupName,
  });
  this.setActiveGroupId();
  this.onRefreshPage();
  //alert(groupName);
}

  createMarkup() { 
    console.log("from createMarkup");
    var text = "<ul style = 'margin-left:-16%'>";

    for(const group of this.state.allGroupDetails)
    {
      text += "<li><button style = 'background: white;border: 0px;border-radius: 5px' id = 'btn" + group.GroupName + "'>" +  group.GroupName + "</button></li>";      
    }

    text += "</ul>"
    return text; 
  } 

  onClickSaveExpense = () =>
  {
    //alert("Expense saved successfully");   
    const expenseDescription = document.getElementById("txtExpenseDescription").value;
    const expense = document.getElementById("txtExpense").value;
    
    if(expenseDescription.trim() === "" || expense.trim() === "" || isNaN(expense.trim()))
    {
      alert("Please enter valid expense details");
      return;
    }
    console.log("Expense" + expense);
    this.setActiveGroupId();
    console.log(this.state.activeGroup + " : " + this.state.activeGroupId);    
    const data = {
        GroupName : this.state.activeGroup,
        Expense : expense,
        ExpenseDescription : expenseDescription,
        UserId : this.state.user.UserId,
        GroupID : this.state.activeGroupId,
        UserName: this.state.user.UserName
    };
    //alert(expense);
    axios.defaults.withCredentials = true;
    axios
      .post(url + "/saveExpense", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        //if (response.status === 200) {
          this.setState({
            authFlag: true,
          });
         
          alert("Expense saved successfully");      
          window.location.reload();   
          this.onRefreshPage();   
        //} 
      })
      .catch((error) => {
        console.log("Error : ", error);
        this.setState({
          authFlag: false,
        });
        
        console.log(error);
        window.location.reload();
        alert("Something went wrong");         
      });   
  }

  getUserName = (UserId) => {
      for(const user of this.state.allUserDetails)
      {
        if(UserId === user.UserId)
          return user.UserName;
      }
  }
  

  onRefreshPage = () =>
  {
      //const a = this.state.allExpenseDetails;
    this.setActiveGroupId();
    //const activeGroupId = this.state.GroupID;
    //console.log(this.state.allExpenseDetails[0].GroupId);
    const currentActiveGroupDetails = [];
    
    for(const obj of this.state.allExpenseDetails)
    {
      console.log("this.state.activeGroupId : " + this.state.activeGroupId);
      console.log("obj.GroupId : " + obj.GroupId);
      if(obj.GroupId === this.state.activeGroupId)
      {
        currentActiveGroupDetails.push(obj);       
      }
    }
    // const currentActiveGroupDetails = this.state.allExpenseDetails.filter(function (e) {
    //     return (e.GroupId) === activeGroupId;
    // });
    console.log(currentActiveGroupDetails);    
    var html = "<div>";
    currentActiveGroupDetails.reverse();
    const cur = [], uniqueExpenseDescription = [], originalExpense = [];
    var exp = [];
    for(const obj of currentActiveGroupDetails)
    {
      if(cur[obj.ExpenseDescription] != null && obj.ExpenseDescription !== undefined)
      {
        cur[obj.ExpenseDescription].Expense += obj.Expense;  
        //exp[obj.ExpenseDescription] = obj.Expense;              
      }
      else
      {
        originalExpense[obj.ExpenseDescription] = obj.Expense;
        cur[obj.ExpenseDescription] = obj;
        uniqueExpenseDescription.push(obj.ExpenseDescription);
      }

      exp[obj.ExpenseDescription] = obj.Expense;              
    }

    var count = 1;
    for(const uep of uniqueExpenseDescription)
    {       
       const obj = cur[uep];
       var date = obj.CreatedTime.split("-");
       const month = this.state.months[date[1] - 1];
       const year = date[0];       
       //const expense = obj.Expense * this.state.activeGroupSize;       

       var expense = (obj.Expense + exp[uep]) + "";
       expense = expense.split('.')[0];
       var UserName = this.getUserName(obj.UserId);
      // alert("UserName : " + UserName + " : " +  this.state.activeGroup);

       if(UserName === this.state.user.UserName)
        {
          //alert("UserName : " + UserName + " : " +  this.state.activeGroup)
          UserName = "You";
        }
       const User = UserName + " paid : ";
       const description = obj.ExpenseDescription;
       html += "<div id = 'divExpense" + count +"'><div style = 'float: left; width: 250px'><label class = 'lblMonth' style = 'margin-left: 5px;margin-right: 5px;font-weight: 100; color: #777272'>" + month + "" + year + "</label>";
       //html += "<label class = 'lblYear' style = 'font-weight: 100; color: #777272'>" + year + "</label>";
       html += "<img alt = '' style = 'width: 30px' src = 'https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/food-and-drink/groceries@2x.png'></img>"
       html += "<label style = 'margin-left: 12px' class = 'lblDescription'>" + description + "</label>";       
       html += "</div><div><label class = 'lblMonth' style='margin-left: 110px;'>" + User + "</label>";
       html += "<label class = 'lblExpense'>" + expense + "</label></div>";
       html += "<br/><br/></div>";
       count++;
    }

    for(const obj of currentActiveGroupDetails)
    {
      obj.Expense = originalExpense[obj.ExpenseDescription];
    }

    html += "</div>";
    //console.log("html : " + html);
    //console.log(document.getElementById("divExpenses"));
    document.getElementById("divExpenses").innerHTML = html;
    var count = 1;
    for(const uep of uniqueExpenseDescription)
    {
      document.getElementById("divExpense" + count).onclick = this.renderExpenseCommensts;
      count++;
    }
    // this.setState({
    //   ExpensesHtml: "<h1>ssup</h1>"
    // });
  }

  renderExpenseCommensts = (e) => {
    this.setState({
      activeExpense : e.target.innerHTML
    })
    
    this.renderCommentsHtml();
  }

  renderCommentsHtml = () =>{
    var html = "<div style = 'width:250px'><h3 style = 'margin-left:15%;text-decoration:underline'>" + this.state.activeExpense + "</h3><label style = 'margin-left:15%;text-decoration:underline'>Notes and Comments :</label>";

    if(this.state.expenseComments[this.state.activeExpense] != null)
    {
      const arr = this.state.expenseComments[this.state.activeExpense].split(";");
      var count = 1;
      for(const comment of arr)
      {
        if(comment === '')
          continue;
        html += "<div id = 'c" + count + "'><label style='margin-left:36px;font-weight:100'>" + comment + "</label></div>"; 
        count++;
      }
    }

    html += "<input type = 'text' id = 'txtExpenseComment' placeholder = 'Enter Comments' style='margin-left:38px;border-radius:4px'></input>";
    html += "<button id = 'btnSubmitComment' style = 'margin-top:11px;border-radius: 5px; border: 0px; color: white; background: rgb(255, 101, 47); height: 23px; width: 51px;margin-left:15%'>Post</button>";
    html += "</div>";
    document.getElementById("divExpenseComments").innerHTML = html;
    document.getElementById("btnSubmitComment").onclick = this.submitExpenseComment;

    if(this.state.expenseComments[this.state.activeExpense] != null)
    {
      const arr = this.state.expenseComments[this.state.activeExpense].split(";");
      var count = 1;
      for(const comment of arr)
      {
        if(comment === '')
          continue;
        document.getElementById("c" + count).onclick = this.deleteExpenseComment;        
        count++;
      }
    }
  }

  deleteExpenseComment = (e) => {    
    this.state.expenseComments[this.state.activeExpense] = this.state.expenseComments[this.state.activeExpense].replace(e.target.innerHTML + ";", "");
    this.state.expenseComments[this.state.activeExpense] = this.state.expenseComments[this.state.activeExpense].replace(e.target.innerHTML, ""); 
    const data = {
      ExpenseComment: this.state.expenseComments[this.state.activeExpense],
      ExpenseName: this.state.activeExpense
    };
    axios.defaults.withCredentials = true;
    axios
      .post(url + "/saveExpenseComment", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.setState({
            authFlag: true,
          });

          //sessionStorage.setItem("user", JSON.stringify(data));
          alert("Expense Comment deleted successfully");
          this.state.expenseComments[this.state.activeExpense] = data.ExpenseComment;
          this.renderCommentsHtml();
          //this.props.loginAction(response.data);

          //console.log("Data from login app.post : " + response.data.UserName);
        } else {
          this.setState({
            authFlag: false,
          });
          alert("500 : Internal Server Error");
        }
      })
      .catch((error) => {
        this.setState({
          authFlag: false,
        });
        alert("500 : Internal Server Error");

        //alert("Inavalid Credentials");
        //console.log("Error");
      });
  }

  submitExpenseComment = (e) => {    
    var expenseComment = document.getElementById("txtExpenseComment").value;

    if(expenseComment == '')
    {
      alert('Please enter valid Expense Comments');
      return;
    }
    var comments = this.state.expenseComments[this.state.activeExpense];
    if(comments != "" && comments != undefined && comments != null)
    {
      expenseComment = comments + ";" + expenseComment;
    }

    const data = {
      ExpenseComment: expenseComment,
      ExpenseName: this.state.activeExpense
    };
    axios.defaults.withCredentials = true;
    axios
      .post(url + "/saveExpenseComment", data)
      .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.setState({
            authFlag: true,
          });

          //sessionStorage.setItem("user", JSON.stringify(data));
          alert("Expense Comment saved successfully");
          this.state.expenseComments[this.state.activeExpense] = data.ExpenseComment;
          this.renderCommentsHtml();
          //this.props.loginAction(response.data);

          //console.log("Data from login app.post : " + response.data.UserName);
        } else {
          this.setState({
            authFlag: false,
          });
          alert("500 : Internal Server Error");
        }
      })
      .catch((error) => {
        this.setState({
          authFlag: false,
        });
        alert("500 : Internal Server Error");

        //alert("Inavalid Credentials");
        //console.log("Error");
      });
    //alert(expenseComment);
  }
  render() {
    //if not logged in go to login page
    let redirectVar = null;
    console.log("Outside if block cookie.load cookie");
    if (!cookie.load("cookie")) {
      console.log("Inside if block cookie.load cookie");
      redirectVar = <Redirect to="/landing" />;
    }
    
    // var groupLinks = "<ul>";
    // for(const group of this.state.allGroupDetails)
    // {
    //   groupLinks += "<li><a href = 'kk'>" +  group.GroupName + "</a></li>";      
    // }
    // groupLinks = "</ul>"
    // console.log(groupLinks);

    return (
      <div>
        {redirectVar}
        
        <div style = {{marginLeft: "95px"}}>
            <div id = "divSideNav" className = "sidenav" style = {{ marginTop: "80px", marginLeft: "11%", height: "100vh", float: "left", width: "200px"}}>           
            </div>            
        </div>         
        <div style = {{ height: "100vh", width: "530px", float: "left", borderRadius: "10px", marginTop: "-18px", border: "1px solid #ddd", marginLeft: "-51px", borderBottom: "0px"}}>
          <div style = {{float: "left", marginTop: "5px"}}><label style = {{fontSize: "33px", marginLeft: "45px"}}>{this.state.activeGroup}</label></div>
          <div style = {{float: "right", marginRight: "50px", marginTop: "5px"}}>          
          <Popup trigger={<button id = "btnAddExpense"  style = {{borderRadius: "5px", border: "0px", color: "white", background: "#ff652f", height: "40px", width: "150px"}}>Add an Expense</button>} modal>
            <div> 
              <div style = {{background: "#5cc5a7", height: "35px", color: "white"}}>
                <label style= {{fontSize: "18px", marginLeft: "5px"}}>Add an expense</label>
              </div>
              <div style= {{marginLeft: "6px", marginTop: "7px"}}>
                With you and: <label>All of {this.state.activeGroup}</label> 
              </div>              
              <img alt = "" style = {{float: "left", marginLeft: "8px"}} src="https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png" class="category"></img>
              <div>
                <input type = "text" id = "txtExpenseDescription" placeholder = "Enter a description" style = {{marginLeft: "25px", borderBottom: "1px dotted !important", border: "0px", borderRadius: "5px", height: "35px", width: "184px", fontSize: "17px"}}></input>
                <input type = "text" id = "txtExpense" placeholder = "$ 0.00" style = {{marginLeft: "25px", borderBottom: "1px dotted !important", border: "0px", marginTop: "5px", height: "41px", width: "184px", fontSize: "18px"}}></input>
              </div>
              <div style = {{marginTop: "122px", marginLeft: "230px"}}>
                <button id = "btnCancelExpense" style = {{width: "60px", height: "40px", border: "0px", borderRadius: "5px"}}>Cancel</button>
                <button id = "btnSaveExpense" onClick = {this.onClickSaveExpense} style = {{background: "#5cc5a7", marginLeft: "5px", width: "60px", height: "40px", border: "0px", borderRadius: "5px"}}>Save</button>                
              </div>
            </div>
          </Popup>
          </div>                   
          <div style = {{marginTop: "62px", paddingLeft: "48px", borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd"}}>
            <label style = {{fontFamily: "-webkit-pictograph"}}>{moment().format("MMMM YYYY")}</label>
          </div>  
          <div id = "divExpenses"></div>        
        </div>   
        <div id = "divExpenseComments" style = {{float: "left", marginTop:"2%"}}></div>
        {/* <div id ="divGroupBalances" style = {{float : "left", marginLeft: "15px", marginTop: "47px"}}> 
          <label style = {{fontWeight : "100", color: "#777272"}}>GROUP BALANCES</label>
        </div>                */}
      </div>
    );
  }
}

export default Groups;
