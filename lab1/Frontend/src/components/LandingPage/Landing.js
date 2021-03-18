import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
//import { connect } from "react-redux";
//import {loginAction} from '../../js/actions/index'

class Landing extends Component {
  constructor(props) {
    console.log("Inside Landing constructor");
    super(props);
    this.state = {
      authFlag: false,
    };
  }

  componentWillMount() {
    this.setState({
      authFlag: false,
    });
  }

  render() {
    let redirectVar = null;
    if (cookie.load("cookie")) {
      console.log("Inside If cookie block in Landing");
      redirectVar = <Redirect to="/home" />;
    }

    console.log("Outside If cookie block in Landing");
    return (
      <div>
        {redirectVar}
        <div class="container" style = {{backgroundImage: "url(https://assets.splitwise.com/assets/images/core/facets.png)"}}>
            <div style = {{float: "left", marginTop: "9%", marginLeft: "11%"}}>            
                <label style = {{color: "#373B3F", lineHeight: "1.25", fontWeight: "700", fontFamily: "inherit", fontSize: "300%"}}>Less stress when<br/> sharing expenses<br/> <label style = {{color: "#1CC29F"}}>with anyone.</label></label>            
                <div style = {{marginLeft: "-35px", fontFamily: "-webkit-pictograph"}}>
                    <ul>
                        <li style = {{display: "inline", paddingRight: "4%"}}>
                        <svg class="fill-current w-9 lg:w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 35" style = {{width: "2.25rem"}}>
                            <path  style = {{fill: "#1CC29F"}} d="M7.844 0L1.961 3.5l11.766 7 3.922 2.333L9.805 17.5 3.922 14 0 16.333l3.922 2.334 1.961 1.166L3.922 21l1.961 1.167V24.5l1.961-1.167v7L11.766 28v-7l7.844-4.667V35l3.922-2.333 1.96-1.167v-7l1.962-1.167V21l-1.961 1.167v-2.334l1.96-1.166v-2.334l-1.96 1.167v-4.667l5.883-3.5L35.298 7V4.667L33.337 3.5l-9.805 5.833L19.61 7l1.961-1.167-1.961-1.166-1.961 1.166-1.961-1.166 1.96-1.167-1.96-1.167L13.727 3.5z"></path>
                        </svg>
                        </li>
                        <li style = {{display: "inline", paddingRight: "4%"}}> 
                        <svg class="fill-current w-9 lg:w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 32" style = {{width: "2.25rem"}}>
                            <path style = {{fill: "#8656cd"}} d="M27.736 15.229V31.02H20.56V22.6h-7.177v8.423H6.207V15.228l7.176-4.211 3.588-2.106 10.765 6.317zm-.03-6.335l5.412 3.176v2.106H29.53l-12.559-7.37-12.558 7.37H.824V12.07l16.147-9.475 7.177 4.211V.49h3.557v8.405z"></path>
                        </svg>
                        </li>
                        <li style = {{display: "inline", paddingRight: "4%"}}> 
                        <svg class="fill-current w-9 lg:w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 29" style = {{width: "2.25rem"}}>
                            <path style = {{fill: "#a6002f"}} d="M15.163 4.311L7.653-.043.143 4.311v15.237l15.02 8.707 15.02-8.707V4.311l-7.51-4.354z"></path>
                        </svg>
                        </li>
                        <li style = {{display: "inline", paddingRight: "4%"}}> 
                        <svg class="fill-current w-9 lg:w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 30" style = {{width: "2.25rem"}}>
                            <path  style = {{fill: "#383b3f"}} d="M11.673.979v9.055L3.519 5.506.461 10.6l8.154 4.528-8.154 4.527L3.52 24.75l8.154-4.528v9.056h6.115V20.22l8.154 4.528L29 19.655l-8.154-4.527L29 10.6l-3.058-5.094-8.154 4.528V.979z"></path>
                        </svg>
                        </li>
                        </ul>
                        <label style = {{marginLeft: "10.5%"}}>Keep track of your shared expenses and <br/>balances with housemates, trips, groups,<br/> friends, and family.</label>
                    </div>                
            </div>
            <div style = {{float: "right", marginTop: "3%", marginRight: "11%"}}>
                <svg class="fill-current w-9 lg:w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 35" style = {{opacity: "0.8", width: "50rem"}}>
                    <path  style = {{fill: "#383b3f"}} d="M11.673.979v9.055L3.519 5.506.461 10.6l8.154 4.528-8.154 4.527L3.52 24.75l8.154-4.528v9.056h6.115V20.22l8.154 4.528L29 19.655l-8.154-4.527L29 10.6l-3.058-5.094-8.154 4.528V.979z"></path>
                </svg>
            </div>                  
      </div>
    </div>    
    );
  }
}

export default Landing;
