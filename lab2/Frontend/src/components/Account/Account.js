import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import reducer from "../../js/reducers/index";
//import store from "../../js/store/index";
import { connect } from "react-redux";
import { loginAction } from "../../js/actions/index";
import FormData from 'form-data'
import {url} from "../Constants";

class AccountClass extends Component {
  constructor() {
    console.log("Inside Account constructor");
    super();
    this.state = {
      user: {},
    };

    this.saveUserDetails = this.saveUserDetails.bind(this);   
  }

  validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validateInputData = (data) => {
    if (
      data.Mail.trim() === "" ||
      data.UserName.trim() === "" ||
      data.Password.trim() === ""
    )
      return false;

    return true;
  };
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

    const regex = /^\d*$/;

    if(!regex.test(data.Phone_Number))
    {
      alert("Please enter valid phone number");
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
          this.setState({
            user : data
          })
          //this.state.user = data;
          alert("User data saved successfully");
          this.uploadFile();

          //this.props.loginAction(response.data);

          //console.log("Data from login app.post : " + response.data.UserName);
        } else {
          this.setState({
            authFlag: false,
          });
          alert("Please enter valid details");
        }
      })
      .catch((error) => {
        this.setState({
          authFlag: false,
        });

        console.log(error.response.data);
        alert(error.response.data.message.sqlMessage);

        //alert("Inavalid Credentials");
        //console.log("Error");
      });
  };

  uploadFile = () =>
  {
    let files = document.getElementById("myImage").files;
    var btnFileData;
    if (FileReader && files && files.length) {
      var fr = new FileReader();
      fr.onload = function () {        
        console.log(document.getElementsByClassName("picture-frame"));
        document.getElementsByClassName("picture-frame")[0].src = fr.result;
        //console.log(fr.result);
        btnFileData = fr.result;
        const user = JSON.parse(sessionStorage.getItem("user"));    
        user.FileBytes = btnFileData;//{mimetype:"buffer", data:myBase64Data};
        sessionStorage.setItem("user", JSON.stringify(user));
      }
      fr.readAsDataURL(files[0]);
    }
    //document.getElementsByClassName("picture-frame").src = photo;
    // var myImage = document.getElementById('myImage');
    // var myCanvas = document.getElementById('mycanvas');
    // var ctx = myCanvas.getContext('2d');
    // ctx.drawImage(myImage, 0, 0);

    //var myDataURL = myCanvas.toDataURL('image/png');
    //var myBase64Data = myDataURL.split(',')[1];
    //console.log(document.getElementsByClassName("picture-frame")[0].src);
    const user = JSON.parse(sessionStorage.getItem("user"));
    //console.log(btnFileData);    
    user.FileBytes = btnFileData;//{mimetype:"buffer", data:myBase64Data};
    sessionStorage.setItem("user", JSON.stringify(user));
    this.setState({
      user : user
    })
    //this.state.user = user;
    console.log(user);
    let formData = new FormData();     
    formData.append("file_uplaoded", files[0]);
    console.log("upload file");
    console.log(files[0]);
    formData.append("UserId", this.state.user.UserId)
    fetch(url + '/saveFile', {method: "POST", body: formData});
  }

  //get the books data from backend
  componentWillMount() {    
    console.log("Inside Account componentDidMount : ");
    //console.log(store.getState());
    console.log(sessionStorage.getItem("user"));
    //this.state.user = JSON.parse(sessionStorage.getItem("user"));
    this.setState({
      user: JSON.parse(sessionStorage.getItem("user"))
    });
    //this.state.setState('user', JSON.parse(sessionStorage.getItem("user")));
    //this.state.user.UserName = "varun";
    //console.log(store.getState().user.UserName + " : " + this.state.user.UserName);
    // axios.get(url + "account").then((response) => {
    //   //update the state with the response data
    //   console.log("Inside account axios.get");
    //   this.setState({
    //     books: this.state.books.concat(response.data),
    //   });
    // });
  }
  componentDidMount(){
    // console.log(document.getElementsByClassName("picture-frame"));
    // var urlCreator = window.URL || window.webkitURL;
    // var binaryData = [];
    // binaryData.push(this.state.user.FileBytes.data);    
    // var imgUrl = urlCreator.createObjectURL(new Blob(binaryData, {type: "application/png"}));
    
      if(this.state.user.FileBytes !== undefined && this.state.user.FileBytes !== null)
      {
        if(this.state.user.FileBytes.data !== undefined && this.state.user.FileBytes.data !== null)
        {
          document.getElementById("imgProfile").src = `data:${this.state.user.FileBytes.mimetype};base64,${Buffer.from(this.state.user.FileBytes.data).toString('base64')}`;
        }
        else
        {
          document.getElementById("imgProfile").src = this.state.user.FileBytes;
        }
      }
    
    
  }

  render() {
    //if not logged in go to login page
    let redirectVar = null;
    console.log("Outside if block cookie.load cookie");
    if (!cookie.load("cookie")) {
      console.log("Inside if block cookie.load cookie");
      redirectVar = <Redirect to="/landing" />;
    }
    const inputTextStyles = {
      width: "210px",
      borderRadius: "5px",
      border: "1px solid #cccccc",
      height: "30px",
    };
    return (
      <div>
        {redirectVar}
        {console.log("inside return")}
        <div id="container" style={{ marginLeft: "25%" }}>
          <div style={{ width: "800px" }}>
            <div
              class="span3 columns"
              style={{ width: "244px", float: "left" }}
            >
              <label style={{ fontSize: "215%" }}>Your account</label>
              
              <img
                id = "imgProfile"
                style = {{height: "214px", width: "85%"}}
                class="picture-frame"
                alt = ""                
                src="https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-orange44-200px.png"
              ></img>
              <input style = {{marginTop: "6px"}} type="file" id="myImage" name="filename"></input>
            </div>
            <div style={{ width: "143px", float: "left", marginTop: "7%" }}>
              <label style={{ fontWeight: "100" }}>Your Name</label>
              <br />
              <input type="text" id="txtName"  defaultValue = {this.state.user.UserName}  style={inputTextStyles} />
              <br />
              <label style={{ fontWeight: "100" }}>Your email address</label>
              <br />
              <input
                type="textbox"
                id="txtEmail"
                defaultValue={this.state.user.Mail}
                style={inputTextStyles}
              />
              <br />
              <label style={{ fontWeight: "100" }}>Your phone number</label>
              <br />
              <input
                type="textbox"
                id="txtPhn"
                defaultValue={this.state.user.Phone_Number}
                style={inputTextStyles}
              />{" "}
              <br />
              <label style={{ fontWeight: "100" }}>Your password</label>
              <br />
              <input
                type="password"
                id="txtPassword"
                defaultValue={this.state.user.Password}
                style={inputTextStyles}
              />
              <br />
            </div>
            <div
              style={{
                float: "left",
                marginTop: "7.1%",
                width: "203px",
                marginLeft: "14%",
              }}
            >
              <label style={{ fontWeight: "100" }}>Your default currency</label>
              <input
                type="textbox"
                id="txtCurrency"
                defaultValue={this.state.user.DefaultCurrency}
                style={inputTextStyles}
              />
              <br />
              <label style={{ fontWeight: "100" }}>Your time zone</label>
              <input
                type="textbox"
                id="txtTimeZone"
                defaultValue="(GMT-08:00) Pacific Time (US & Canada)"
                style={inputTextStyles}
              />
              <br />
              <label style={{ fontWeight: "100" }}>Language</label>
              <input
                type="textbox"
                id="txtLanguage"
                defaultValue={this.state.user.Language}
                style={inputTextStyles}
              />
              <br />
            </div>
          </div>
          <div style={{ float: "left", marginLeft: "54%", marginTop: "28px" }}>
            <button
              onClick={this.saveUserDetails}
              class="btn btn-primary"
              style={{
                backgroundColor: "#ff652f",
                border: "0px",
                borderRadius: "6px",
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log("mapStateToProps : " + state);
  return {
    user: state.user,
  };
};

const Account = connect(mapStateToProps, { loginAction })(AccountClass);
//export default Login;
//export Home Component
export default Account;
