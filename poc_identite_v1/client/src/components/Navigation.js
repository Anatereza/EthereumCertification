import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navigation extends Component {
    render() {
        return (
           <div className='navbar'>
               <Link to ='/' className ="heading">HOME</Link>
               <Link to ='/MyIdentity'>IDENTITY</Link>
           </div> 
        );
    }

}

export default Navigation;
