import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class Home extends Component {
    constructor(){
        console.log("Inside Home constructor");
        super();
        this.state = {  
            books : []
        }
    }  
    //get the books data from backend  
    componentDidMount(){
        console.log("Inside Home componentDidMount");
        axios.get('http://localhost:3001/home')
                .then((response) => {
                //update the state with the response data
                console.log("Inside Home axios.get");
                this.setState({
                    books : this.state.books.concat(response.data) 
                });
            });
    }

    render(){
        //iterate over books to create a table row        
        //if not logged in go to login page
        let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
        }
        return(
            <div>
                {redirectVar}
                <div class="container">
                    
                </div> 
            </div> 
        )
    }
}
//export Home Component
export default Home;