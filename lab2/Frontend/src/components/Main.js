import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import Navbar from './LandingPage/Navbar';
import Signup from './Signup/Signup';
import Home from './Home/Home';
import Landing from './LandingPage/Landing';
import Account from './Account/Account';
import CreateNewGroup from './CreateNewGroup/CreateNewGroup';
import Groups from './Groups/Groups';
import RecentActivity from './RecentActivity/RecentActivity';
import MyGroups from './MyGroups/MyGroups';
//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/" component={Navbar}/>
                <Route path="/login" component={Login}/>
                <Route path="/signup" component={Signup}/>    
                <Route path="/home" component={Home}/> 
                <Route path="/landing" component={Landing}/>      
                <Route path="/account" component={Account}/>      
                <Route path="/createNewGroup" component={CreateNewGroup}/>      
                <Route path="/groups" component={Groups}/>  
                <Route path="/recentActivity" component={RecentActivity}/>      
                <Route path="/myGroups" component={MyGroups}/>      
            </div>
        )
    }
}
//Export The Main Component
export default Main;