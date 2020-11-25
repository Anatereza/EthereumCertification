import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavigationHospital extends Component {
    render() {
        return (
           <div className='navbar'>
               <div className="Hospital">HOSPITAL</div>
               <Link to ='/' className ="heading">HOME</Link>
               <Link to ='/BirthDetails'>BIRTHS</Link>
               <Link to ='/AddBirth'>ADD BIRTH</Link>
           </div> 
        );
    }

}

export default NavigationHospital;
