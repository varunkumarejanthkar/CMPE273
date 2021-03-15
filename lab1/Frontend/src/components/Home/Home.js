import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
//import cookie from 'react-cookies';
//import {Redirect} from 'react-router';

class Home extends Component {
    constructor(){
        console.log("Inside Component Constructor")
        super();
        this.state = {  
            books : []
        }
    }  
    //get the books data from backend  
    componentDidMount(){
        axios.get('http://localhost:3001/home')
                .then((response) => {
                //update the state with the response data
                this.setState({
                    books : this.state.books.concat(response.data) 
                });
            });
    }

    render(){
        //iterate over books to create a table row
        // let details = this.state.books.map(book => {
        //     return(
        //         <tr>
        //             <td>{book.BookID}</td>
        //             <td>{book.Title}</td>
        //             <td>{book.Author}</td>
        //         </tr>
        //     )
        // })
        //if not logged in go to login page
        let redirectVar = null;
        // if(!cookie.load('cookie')){
        //     redirectVar = <Redirect to= "/login"/>
        // }
        return(
            <div>
                {/* {redirectVar} */}
                <div class="container">
                    <h1>Welcome To Splitwise!</h1>
                </div> 
            </div> 
        )
    }
}
//export Home Component
export default Home;