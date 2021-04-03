import React, {Component} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';
import {url} from "../Constants"

class Create extends Component{
    constructor(props){        
        super(props);        

        this.state = {
            bookId : "",
            title : "",
            author : ""
        }
        
        this.bookIdChangeHandler = this.bookIdChangeHandler.bind(this);
        this.titleChangeHandler = this.titleChangeHandler.bind(this);
        this.authorChangeHandler = this.authorChangeHandler.bind(this);
        this.bookIdFocusOutHandler = this.bookIdFocusOutHandler.bind(this);
        this.submitCreateBook = this.submitCreateBook.bind(this);
    }

    bookIdChangeHandler = (e) => {      
        this.setState({
            bookId : e.target.value
        })               
    }
    
    bookIdFocusOutHandler = (e) => {
        const bookId = e.target.value;
        const regex = new RegExp("[0-9]+");
        console.log("Inside bookIdFocusOutHandler");

        if(!regex.test(Number(bookId)))
        {       
            e.target.value = "";
            document.getElementById("lblBookId").innerHTML = "Please enter only numeric values.";
        }
        else{
            document.getElementById("lblBookId").innerHTML = "";
        }
    }

    titleChangeHandler = (e) => {
        document.getElementById("lblTitle").innerHTML = "";

        this.setState({
            title : e.target.value
        })
    }
    
    authorChangeHandler = (e) => {
        document.getElementById("lblAuthor").innerHTML = "";

        this.setState({
            author : e.target.value
        })
    }

    submitCreateBook = (e) => {
        var headers = new Headers();        
        e.preventDefault();
        const data = {
            bookId : this.state.bookId,
            title : this.state.title,
            author : this.state.author
        }

        if(data.bookId == "" || data.title == "" || data.author == "")
        {
            if(data.bookId == "")
                document.getElementById("lblBookId").innerHTML = "Book ID is required.";

            if(data.title == "")
                document.getElementById("lblTitle").innerHTML = "Title is required.";
            
            if(data.author == "")
                document.getElementById("lblAuthor").innerHTML = "Author is required.";

            return;
        }
       
        axios.defaults.withCredentials = true;       
        axios.post(url + '/create',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log(response.data)
                    this.setState({
                        authFlag : true
                    });
                    this.props.history.push("/home");
                }else{                    
                    this.setState({
                        authFlag : false
                    })
                }
            },
            )
            .catch(error => {
                document.getElementById("divErrorMsg").style.fontSize = "112%";
                document.getElementById("divErrorMsg").style.marginTop = "2%";
                document.getElementById("divErrorMsg").innerHTML = "Please Enter Unique Book Id";    
            })            
        }

    render(){
        if(!cookie.load('cookie')){
            this.props.history.push("/login");           
        }
        return(
            <div>
                <br/>
                <div class="container">
                    <form action="http://127.0.0.1:3000/create" method="post">
                        <div style={{width: '30%'}} class="form-group">
                            <input  onChange = {this.bookIdChangeHandler} onBlur = {this.bookIdFocusOutHandler} type="text" class="form-control" name="BookID" placeholder="Book ID"/>
                            <label style = {{color : "red", fontSize : "11px", marginLeft : "3px"}} id = "lblBookId"></label>
                        </div>                        
                        <br/>
                        <div style={{width: '30%'}} class="form-group">
                            <input  onChange = {this.titleChangeHandler} type="text" class="form-control" name="Title" placeholder="Book Title"/>
                            <label style = {{color : "red", fontSize : "11px", marginLeft : "3px"}} id = "lblTitle"></label>
                        </div>                        
                        <br/>
                        <div style={{width: '30%'}} class="form-group">
                            <input  onChange = {this.authorChangeHandler} type="text" class="form-control" name="Author" placeholder="Book Author"/>
                            <label style = {{color : "red", fontSize : "11px", marginLeft : "3px"}} id = "lblAuthor"></label>
                        </div>                        
                        <br/>
                        <div style={{width: '30%'}}>
                            <button onClick = {this.submitCreateBook} class="btn btn-success" type="submit">Create</button>
                        </div> 
                    </form>
                    <div id = "divErrorMsg" style = {{color: 'red'}}></div>
                </div>
            </div>
        )
    }
}

export default Create;