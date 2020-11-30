import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavigationCityHall extends Component {
    render() {
        return (
           <div className='navbar'>
               <div className="CityHall">CITY HALL</div>
               <Link to ='/' className ="heading">HOME</Link>
               <div> | </div>
               <Link to ='/IdentityDetails'>CHECK IDENTITIES</Link>
               <div> | </div>
               <Link to ='/AddMarriage'>DECLARE MARRIAGE</Link>               
           </div> 
        );
    }

}

export default NavigationCityHall;
