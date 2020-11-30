import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavigationHospital extends Component {
    render() {
        return (
           <div className='navbar'>
               <div className="Hospital">HOSPITAL</div>
               <Link to ='/' className ="heading">HOME</Link>
               <div> | </div>
               <Link to ='/BirthDetails'>CHECK BIRTHS</Link>
               <div> | </div>
               <Link to ='/AddBirth'>ADD NEW BIRTH</Link>
           </div> 
        );
    }

}

export default NavigationHospital;
