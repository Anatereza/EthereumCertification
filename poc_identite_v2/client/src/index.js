import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './components/Home';
import UpdateMyPassword from './components/UpdateMyPassword';
import BirthDetails from './components/BirthDetails';
import AddBirth from './components/AddBirth';
import VerifyIdentity from './components/VerifyIdentity';
import IdentityDetails from './components/IdentityDetails';
import AddMarriage from './components/AddMarriage';
import AddHospitalMember from './components/AddHospitalMember';
import AddPrefectureMember from './components/AddPrefectureMember';
import AddCityHallMember from './components/AddCityHallMember';
import GenerateCertification from './components/GenerateCertification';
import VerifyCertification from './components/VerifyCertification';

import {Router, Switch, Route } from 'react-router-dom';
import history from './history';

ReactDOM.render(
    <Router history={history}>
        <Switch>
           <Route exact path='/' component={Home} />
           <Route path='/UpdateMyPassword' component={UpdateMyPassword} />
           <Route path='/BirthDetails' component={BirthDetails} />
           <Route path='/AddBirth' component={AddBirth} />
           <Route path='/VerifyIdentity' component={VerifyIdentity} />
           <Route path='/IdentityDetails' component={IdentityDetails} />
           <Route path='/AddMarriage' component={AddMarriage} />
           <Route path='/AddHospitalMember' component={AddHospitalMember} /> 
           <Route path='/AddPrefectureMember' component={AddPrefectureMember} />
           <Route path='/AddCityHallMember' component={AddCityHallMember} />      
           <Route path='/GenerateCertification' component={GenerateCertification} />
           <Route path='/VerifyCertification' component={VerifyCertification} />                             
        </Switch>
    </Router>,    
    document.getElementById('root')
);