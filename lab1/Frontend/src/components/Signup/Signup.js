import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import { connect } from "react-redux";
import {loginAction} from '../../js/actions/index'
import {url} from "../Constants"

//Define a Signup Component
class Signup extends Component{
    //call the constructor method
    constructor(props){
        console.log("Hey from signup constructor");
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            username : "",
            password : "",
            emailAddress : "",
            authFlag : false
        }
        //Bind the handlers to this class
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.emailAddressChangeHandler = this.emailAddressChangeHandler.bind(this);
        this.submitSignup = this.submitSignup.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }

    emailAddressChangeHandler = (e) => {
        this.setState({
            emailAddress : e.target.value
        })
    }
    //username change handler to update state variable with the text entered by the user
    usernameChangeHandler = (e) => {
        this.setState({
            username : e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    validateInputData = (data) => {        
        if(data.emailAddress.trim() === "" || data.username.trim() === "" || data.password.trim() === "")
            return false;

        return true;
    }

    //submit Login handler to send a request to the node backend
    submitSignup = async (e) => {
        
        e.preventDefault();
        const data = {
            emailAddress : this.state.emailAddress,
            username : this.state.username,
            password : this.state.password
        }

        if(!this.validateInputData(data))
        {
            alert("Please enter valid input");
            return;
        }
        else if(!this.validateEmail(data.emailAddress))
        {
            alert("Please enter valid email format");
            return;
        }

        console.log(data.username);
        await this.props.loginAction(data);
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(url + '/Signup',data)
            .then(response => {
                console.log("Inside axios signup : ",response.status);
                if(response.status === 200){
                    this.setState({
                        authFlag : true
                    })

                    console.log("Inside axios signup : ",response.status);
                    console.log(response.data);
                    sessionStorage.setItem("user", JSON.stringify(response.data));
                    //sessionStorage.setItem("user", JSON.stringify(response.data[0]));
                    this.props.history.push("/home");                    
                }else{
                    this.setState({
                        authFlag : false
                    })
                    alert("Something went wrong");
                }
            })
            .catch(error => {                
                console.log("Error : " + error.status);  
                alert("Something went wrong");
                //this.props.history.push("/home");  
            });
    }

    render(){        
        let redirectVar = null;
        // if(cookie.load('cookie')){
        //     console.log("Inside If cookie block in login");            
        //     redirectVar = <Redirect to= "/home"/>
        // }

        console.log("Outside If cookie block in login");            
        return(
            <div>
                {redirectVar}
            <div class="container">
            <img width="200" height="200" alt = "" style = {{float: "left", marginLeft: "17%", marginTop: "5%"}} class="login_logo" src="https://assets.splitwise.com/assets/core/logo-square-65a6124237868b1d2ce2f5db2ab0b7c777e2348b797626816400534116ae22d7.svg"></img>
                <div class="login-form" style = {{marginTop: "-31px"}}>
                    <div class="main-div">
                        <div class="panel">
                            <div class="form-group" style = {{fontSize: "16px", color: "#999", fontWeight: "bold", lineHeight: "20px", textTransform: "uppercase", paddingRight: "87px"}}>WELCOME TO SPLITWISE</div>
                            <div class="form-group">                                
                                <label style = {{fontSize: "18px", fontWeight: "normal", float: "left"}}>Hi there! My name is</label>
                                <input onChange = {this.usernameChangeHandler} type="text" class="form-control" name="name" placeholder="Name"/>
                            </div>
                            <div class="form-group">                                
                                <label style = {{fontSize: "18px", fontWeight: "normal", float: "left"}}>Email address</label>
                                <input onChange = {this.emailAddressChangeHandler} type="text" class="form-control" name="emailAdress" placeholder="EmailAddress"/>
                            </div>
                            <div class="form-group">
                                <label style = {{fontSize: "18px", fontWeight: "normal", float: "left"}}>Password</label>
                                <input onChange = {this.passwordChangeHandler} type="password" class="form-control" name="password" placeholder="Password"/>
                            </div>
                            <button onClick = {this.submitSignup} class="btn btn-primary">Signup</button>                 
                        </div>
                </div>     
                </div>     
                </div>     
                </div>                    
        )
    }
}

const mapStateToProps = (state) => {
    console.log("mapStateToProps : " + state);
    //const {username, password} = state;
    return ({
        user: state.user
    });
}

//export Login Component
const SignupClass = connect(mapStateToProps, {loginAction})(Signup);
export default SignupClass;