import React, {Component} from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';

class Delete extends Component{
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            deleteId : "",
            authFlag : false           
        }
        //Bind the handlers to this class
        this.deleteChangeHandler = this.deleteChangeHandler.bind(this);       
        this.delete = this.delete.bind(this);
    }

    deleteChangeHandler = (e) => {
        this.setState({
            deleteId : e.target.value
        })
    }

    delete = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            deleteId : this.state.deleteId
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/delete',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.authFlag = true;
                    this.render();
                    this.props.history.push("/home");                   
                }else{                  
                        this.authFlag = false;                   
                }
            })
            .catch(error => {
                document.getElementById("divErrorMsg").innerHTML = "BOOK ID doesn't exist";    
            });
        }

    render(){        
        if(!cookie.load('cookie')){
            this.props.history.push("/login");           
        }        
        return(            
            <div class="container">
                <form>
                    <div style={{width: "50%",float: "left"}} class="form-group">
                        <input  type="text" onChange = {this.deleteChangeHandler} class="form-control" name="BookID" placeholder="Search a Book by Book ID"/>
                    </div>
                    <div style={{width: "50%", float: "right"}}>
                            <button onClick = {this.delete} class="btn btn-success" type="submit">Delete</button>
                    </div> 
                </form>
                <div id = "divErrorMsg" style = {{color: 'red', fontSize: '112%', marginTop: '5%', marginLeft: '-50%', float: 'left'}}></div>
            </div>           
        )
    }
}

export default Delete;