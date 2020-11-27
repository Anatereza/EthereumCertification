import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavigationAdmin extends Component {
    render() {
        return (
           <div className='navbar'>
               <div className="Admin">ADMIN</div>
               <Link to ='/' className ="heading">HOME</Link>
               <div> | </div>
               <Link to ='/AddHospitalMember'>ADD HOSPITAL MEMBER</Link>
               <div> | </div>
               <Link to ='/AddPrefectureMember'>ADD PREFECTURE MEMBER</Link>
               <div> | </div>
               <Link to ='/AddCityHallMember'>ADD CITY HALL MEMBER</Link>               
           </div> 
        );
    }

}

export default NavigationAdmin;
