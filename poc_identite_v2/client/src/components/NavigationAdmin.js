import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavigationAdmin extends Component {
    render() {
        return (
           <div className='navbar'>
               <div className="Admin">ADMIN</div>
               <Link to ='/' className ="heading">HOME</Link>
               <Link to ='/AddHospitalMember'>ADD HOSPITAL MEMBER</Link>
               <Link to ='/AddPrefectureMember'>ADD PREFECTURE MEMBER</Link>
               <Link to ='/AddCityHallMember'>ADD CITY HALL</Link>               
           </div> 
        );
    }

}

export default NavigationAdmin;
