import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavigationPrefecture extends Component {
    render() {
        return (
           <div className='navbar'>
               <div className="Prefecture">PREFECTURE</div>
               <Link to ='/' className ="heading">HOME</Link>
               <Link to ='/BirthDetails'>BIRTHS</Link>
               <Link to ='/VerifyIdentity'>VERIFY IDENTITY</Link>
               <Link to ='/IdentityDetails'>IDENTITIES</Link>               
           </div> 
        );
    }

}

export default NavigationPrefecture;
