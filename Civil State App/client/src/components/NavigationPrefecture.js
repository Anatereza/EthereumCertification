import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavigationPrefecture extends Component {
    render() {
        return (
           <div className='navbar'>
               <div className="Prefecture">PREFECTURE</div>
               <Link to ='/' className ="heading">HOME</Link>
               <div> | </div>
               <Link to ='/BirthDetails'>CHECK BIRTHS</Link>
               <div> | </div>
               <Link to ='/VerifyIdentity'>VERIFY IDENTITY</Link>
               <div> | </div>
               <Link to ='/IdentityDetails'>CHECK IDENTITIES</Link>               
           </div> 
        );
    }

}

export default NavigationPrefecture;
