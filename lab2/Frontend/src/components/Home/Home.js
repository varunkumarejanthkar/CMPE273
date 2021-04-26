import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../../App.css';
import {url} from "../Constants";
import { connect } from "react-redux";
import { groupsAction } from "../../js/actions/index";
import { loginAction } from "../../js/actions/index";
class HomeClass extends Component {
    constructor(){
        console.log("Inside Home constructor");
        super();
        this.state = {  
           surlprus: 0,
           deficit: 0,
           settleUpobjs: [],
           modalHtml: "",
           settleUpList: {}
        }
    }  
    
    componentWillMount()
    {      
        if(sessionStorage.getItem("user") === null)
        {
            return;
        }

        console.log("Inside MyGroups componentDidMount : ");   
        // const obj = JSON.parse(sessionStorage.getItem("user"));
        // this.setState({
        //     user : obj
        // }); 
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
    
                    //this.props.groupsAction(response.data[0]);

                    console.log(this.state.allGroupDetails);    
                    
                    axios.get(url + '/createNewGroup')
                    .then((response) => {             
                        this.setState({
                            allUserDetails: response.data
                        })
    
                        console.log(this.state.allUserDetails);  
                        this.renderDashboard();                  
                    })
                    .catch((error) => {
                        this.setState({
                            authFlag: false,
                        });       
                        console.log(error);
                        alert("Something went wrong");        
                    })
                })
                .catch((error) => {
                    this.setState({
                        authFlag: false,
                    });       
                    console.log(error);
                    alert("Something went wrong");        
                    })
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

    renderDashboard = () =>
    {
        const curUserDeficitObjects = [];
        const curUserSurlprusObjects = [];
        var deficit = 0, surlprus = 0;
        const surlprusObj = {}, deficitObj = {};
        console.log("Inside renderDashboard");

        for(const obj of this.state.allExpenseDetails)
        {
            if(obj.UserId === this.state.user.UserId)
            {
                surlprus += obj.Expense;
                curUserSurlprusObjects.push(obj);
                if(surlprusObj[obj.UserId2] === undefined)
                    surlprusObj[obj.UserId2] = obj.Expense;
                else
                    surlprusObj[obj.UserId2] = surlprusObj[obj.UserId2] + obj.Expense;
            }
            else if(obj.UserId2 === this.state.user.UserId)
            {
                deficit += obj.Expense;
                curUserDeficitObjects.push(obj);
                if(deficitObj[obj.UserId] === undefined)
                    deficitObj[obj.UserId] = obj.Expense;
                else
                    deficitObj[obj.UserId] = deficitObj[obj.UserId] + obj.Expense;
                
            }
        }

        this.setState({
            surlprus: surlprus,
            deficit: deficit
        });

        const arr = [];
        for(const obj in surlprusObj)
        {         
            this.state.settleUpobjs.push(obj);
            arr.push(obj.UserName);
           if(deficitObj[obj] !== undefined)
           {
                if(surlprusObj[obj] > deficitObj[obj])
                {
                    surlprusObj[obj] = surlprusObj[obj] - deficitObj[obj];
                    deficitObj[obj] = 0;
                }
                else{
                    //this.state.settleUpobjs.push(obj);
                    deficitObj[obj] = deficitObj[obj] - surlprusObj[obj];
                    surlprusObj[obj] = 0;
                }
           }
        }

        for(const obj in deficitObj)
        {
            if(arr.includes(obj.UserName))
            {
                continue;
            }
            this.state.settleUpobjs.push(obj);
        }

        var html = "<ul>";
        console.log(surlprusObj);
        for(const obj in surlprusObj)
        {            
            if(surlprusObj[obj] === 0)
            {
                continue;
            }
            console.log(obj);
            const userName = this.getUserNameFromId(obj);
            console.log(userName + " : " + surlprusObj[obj]);
            html += "<li><label>" + userName + " : $" + surlprusObj[obj] +"</label></li>";
        }

        document.getElementById("divOweYou").innerHTML = html; 
        var html2 = "<ul>";

        for(const obj in deficitObj)
        {            
            if(deficitObj[obj] === 0)
            {
                continue;
            }
            console.log(obj);
            html2 += "<li><label>" + this.getUserNameFromId(obj) + " : $" + deficitObj[obj] +"</label></li>";
        }   
        
        document.getElementById("divYouOwe").innerHTML = html2; 
        this.renderSettleUpModal();        
    }

    getUserNameFromId = (userId) => {
        for(const obj of this.state.allUserDetails)
        {            
            if((obj.UserId + "") === userId)
            {                
                return obj.UserName;
            }
        }
    }

    renderSettleUpModal = () =>
    {
        var html = ""
        const createObj = {}
        for(const obj of this.state.settleUpobjs)
        {
            const userName = this.getUserNameFromId(obj);
            createObj[userName] = obj;
            html += "<button id = 'btn"+ userName + "' style = 'font-size: 42px;font-weight:700;margin-left: 100px; margin-top: 5px; border-radius: 5px; border: 0px; background: white'>" + userName + "</button>";
             

            //document.getElementById("btn" + userName).onclick = this.settleUp;
        }

        this.setState( 
            {
                modalHtml : html,
                settleUpList: createObj
            });            
    }

    renderOnClickEvent = () => 
    {        
        for(const obj in this.state.settleUpList)
        {
            document.getElementById("btn" + obj).onclick = this.settleUpFunc;
        }
    }
    settleUpFunc = (e) => {
        const userName2 = e.srcElement.id.substring(3, e.srcElement.id.length);
        const curUserId = this.state.user.UserId;
        const userId2 = this.state.settleUpList[userName2];
        const userName1 = this.state.user.UserName;
        //alert(curUserId + " : " + userName + " : " + userId2);
        const data = {
            UserName1 : userName1,
            UserName2 : userName2,
            UserId : curUserId,
            UserId2 : userId2
        }
        axios.defaults.withCredentials = true;
        axios
          .post(url + "/settleUpExpenses", data)
          .then((response) => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
              this.setState({
                authFlag: true,
              });
    
              //sessionStorage.setItem("user", JSON.stringify(data));
              alert("Settled up the expenses successfully");
              window.location.reload();
              //this.props.loginAction(response.data);
    
              //console.log("Data from login app.post : " + response.data.UserName);
            } else {
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
                alert("Something went wrong");
            });
    }

    render(){
        //iterate over books to create a table row        
        //if not logged in go to login page
        let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/landing"/>
        }
        return(
            <div>
                {redirectVar}
                <div class="container">
                    <div>                   
                        <div style = {{marginLeft: "23%", borderLeft: "1px solid #ddd", height: "100vh", marginTop: "-2%", width: "50%", borderRight: "1px solid #ddd"}}>
                            <div style = {{background: "#ddd", height: "21%"}}>
                                <div style = {{float: "left"}}><label style = {{fontSize: "26px", marginTop: "-8px", marginLeft: "18px"}}>Dashboard</label></div>
                                <div style = {{paddingLeft: "73%", paddingTop: "9px"}}>
                                    <Popup trigger={<button id = "btnSettleUp" onClick = {this.renderOnClickEvent} style = {{fontSize: "18px", width: "106px",height:"37px", borderRadius: "5px", border: "0px", background: "#5bc5a7", color: "white"}}>Settle Up</button>} modal>
                                        <div>
                                            <button style = {{border: "none", cursor:"none", fontSize:"20px",outline: "none",  marginLeft: "117px", background: "white"}} onClick = {this.renderOnClickEvent}>Settle Up</button>
                                        </div>
                                        <div id = "divSettleUpModal" dangerouslySetInnerHTML = {{ __html: this.state.modalHtml }}>                                                                                        
                                        </div>  
                                        {/* <script type="text/javascript">
                                            {this.renderOnClickEvent()};
                                        </script>                                      */}
                                    </Popup>                                    
                                </div>
                                <div style = {{borderTop: "1px solid white", marginTop: "2%"}}>
                                    <div style = {{float: "left", width: "20%", marginTop: "2%", marginLeft: "4%"}}>
                                        <label style = {{fontWeight : "100"}}>total balance</label>
                                    </div>
                                    <div style = {{float: "left", width: "20%", marginTop: "1.5%", marginLeft: "14%"}}>
                                        <label style = {{fontWeight : "100"}}>you owe</label>
                                    </div>
                                    <div style = {{float: "left", marginTop: "1.5%", marginLeft: "15%"}}>
                                        <label style = {{fontWeight : "100"}}>you are owed</label>
                                    </div>
                                </div>
                                <div style = {{marginTop: "7%", marginLeft: "5%"}}>
                                    <div style = {{float: "left", width: "20%", marginTop: "1%", marginLeft: "-2%"}}>
                                        <label style = {{fontWeight : "100"}}>${this.state.surlprus - this.state.deficit}</label>
                                    </div>
                                    <div style = {{float: "left", width: "20%", marginTop: "1%", marginLeft: "17%"}}>
                                        <label style = {{fontWeight : "100"}}>${this.state.deficit}</label>
                                    </div>
                                    <div style = {{float: "left", marginTop: "1%", marginLeft: "12%", paddingLeft: "22px"}}>
                                        <label style = {{fontWeight : "100"}}>${this.state.surlprus}</label>
                                    </div>
                                </div>
                            </div>
                            <div style = {{marginTop: "3%"}}>
                                <div style = {{marginLeft: "5%", float: "left", marginTop: "2%"}}>
                                    <label style = {{color: "#756464"}}>PEOPLE YOU OWE</label>
                                </div>
                                <div style = {{marginRight: "9%", float: "right", marginTop: "2%"}}>
                                    <label style = {{color: "#756464"}}>PEOPLE WHO OWE YOU</label>
                                </div>
                                <div id = "divYouOwe" style = {{float: "left", marginTop: "6%", width: "55%"}}>
                                </div>                                
                                <div id = "divOweYou" style = {{float: "left", marginLeft: "55%", marginTop:"-6%"}}>
                                </div>
                            </div>
                        </div>

                    </div>
                </div> 
            </div> 
        )
    }
}
//export Home Component
const mapStateToProps = (state) => {
    console.log("mapStateToProps : " + state);
    return {
      groups: state.groups,
    };
  };
  
const Home = connect(mapStateToProps, { groupsAction })(HomeClass);
export default Home;