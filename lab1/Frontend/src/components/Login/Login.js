import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { connect } from "react-redux";
import {loginAction} from '../../js/actions/index'

class LoginClass extends Component{    
    constructor(props){               
        super(props);        
        this.state = {
            mail : "",
            password : "",
            authFlag : false
        }        
        this.mailChangeHandler = this.mailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    
    mailChangeHandler = (e) => {
        console.log("mailChangeHandler : " + e.target.value);
        this.setState({
            mail : e.target.value
        })
    }
    
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    
    submitLogin = async (e) => {
        e.preventDefault();
        const data = {
            mail : this.state.mail,
            password : this.state.password
        }

        console.log("submitLogin : " + data.mail + "Password : " + data.password);      
        await this.props.loginAction(data);        
        axios.defaults.withCredentials = true;        
        axios.post('http://localhost:3001/login',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        authFlag : true
                    })
                }else{
                    this.setState({
                        authFlag : false
                    })
                }
            })
            .catch(error => {                
                console.log("Error");   
            });
    }

    render(){        
        let redirectVar = null;
        if(cookie.load('cookie')){
            console.log("Inside If cookie block in login");            
            redirectVar = <Redirect to= "/home"/>
        }

        console.log("Outside If cookie block in login");            
        return(
            <div>
                {redirectVar}
            <div class="container">
            <img width="200" height="200" alt = "" style = {{float: "left", marginLeft: "17%", marginTop: "5%"}} class="login_logo" src="https://assets.splitwise.com/assets/core/logo-square-65a6124237868b1d2ce2f5db2ab0b7c777e2348b797626816400534116ae22d7.svg"></img>
                <div class="login-form">
                    <div class="main-div">
                        <div class="panel">
                            <div class="form-group" style = {{fontSize: "16px", color: "#999", fontWeight: "bold", lineHeight: "20px", textTransform: "uppercase", paddingRight: "87px"}}>WELCOME TO SPLITWISE</div>
                            <div class="form-group">                                
                                <label style = {{fontSize: "18px", fontWeight: "normal", float: "left"}}>Email address</label>
                                <input onChange = {this.mailChangeHandler} type="text" class="form-control" name="mail" placeholder="EmailAddress"/>
                            </div>
                            <div class="form-group">
                                <label style = {{fontSize: "18px", fontWeight: "normal", float: "left"}}>Password</label>
                                <input onChange = {this.passwordChangeHandler} type="password" class="form-control" name="password" placeholder="Password"/>
                            </div>
                            <button onClick = {this.submitLogin} class="btn btn-primary">Login</button>                 
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
    return ({
        user: state.user
    });
}

const Login = connect(mapStateToProps, {loginAction})(LoginClass);
export default Login;