import React, { Component } from "react";
import CivilStateContract from "../contracts/CivilState.json";
import getWeb3 from "../getWeb3";

// FormGroup to take input from user
import { FormGroup, FormControl, Button } from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import NavigationHospital from './NavigationHospital';
import NavigationPrefecture from './NavigationPrefecture';
import NavigationCityHall from './NavigationCityHall';
import Navigation from './Navigation';


class UpdateMyPassword extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
          CivilStateInstance: undefined,
          account: null,
          web3: null,
          login :'',
          oldPassword : '',
          newPassword: '',
          isAdmin: false,
          isHospital: false,
          isPrefecture: false,
          isCityHall: false,
        }
    
    }

    
    updateLogin = event => {
        this.setState({ login : event.target.value});
    }

    updateOldPassword = event => {
        this.setState({ oldPassword : event.target.value});
    }    

    updateNewPassword = event => {
        this.setState({ newPassword : event.target.value});
    }    

    modifyPasswordInBlockchain = async() =>  {
      try {  
        // (string memory _login, string memory _oldPwd, string memory _newPwd)
        await this.state.CivilStateInstance.methods.modifyMyPassword(
              this.state.login,
              this.state.oldPassword,
              this.state.newPassword)
              .send({
                  from : this.state.account,
                  gas: 1000000
              })
        alert('Password was modified');
      } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
          }  
    }

    componentDidMount = async () => {
        // FOR REFRESHING PAGE ONLY ONCE -
        if(!window.location.hash){
          window.location = window.location + '#loaded';
          window.location.reload();
        }
    
        try {
          // Get network provider and web3 instance.
          const web3 = await getWeb3();
    
          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts();
    
          // Get the contract instance.
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = CivilStateContract.networks[networkId];
          const instance = new web3.eth.Contract(
              CivilStateContract.abi, 
              deployedNetwork && deployedNetwork.address,
          );

          // Set web3, accounts, and contract to the state
          // account[0] = default account used by metamask
          this.setState({ CivilStateInstance: instance, web3: web3, account: accounts[0] });

          //Verify if hospital, prefecture, city hall or citizen
          const owner = await this.state.CivilStateInstance.methods.getOwner().call();
          if (this.state.account === owner) {
            this.setState({isAdmin : true});
          }

          const hospitalMember = await this.state.CivilStateInstance.methods.isHospitalMember().call({from : this.state.account});
          if (this.state.account === hospitalMember) {
            this.setState({isHospital : true});
          }

          const prefectureMember = await this.state.CivilStateInstance.methods.isPrefectureMember().call({from : this.state.account});
          if (this.state.account === prefectureMember) {
            this.setState({isPrefecture : true});
          }  
          
          const cityHallMember = await this.state.CivilStateInstance.methods.isCityHallMember().call({from : this.state.account});
          if (this.state.account === cityHallMember) {
            this.setState({isCityHall : true});
          }
        
    
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
    };

    render() {
        let menu;
        if (this.state.isAdmin) {
          menu = <NavigationAdmin />
        } else if (this.state.isHospital) {
          menu = <NavigationHospital />
        } else if (this.state.isPrefecture) {
          menu = <NavigationPrefecture />
        } else if (this.state.isCityHall) {
          menu = <NavigationCityHall />
        } else {
          menu = <Navigation />
        }       
        
        if (!this.state.web3) {      
          return (
            <div className="IdentityDetails">
                <div className="IdentityDetails-title">
                  <h1>
                    Loading Web3, accounts, and contract...
                  </h1>
                </div>
                {menu}
            </div>
          );
        }             

        return (
          <div className="App">

            <div className="IdentityDetails">
              <div className="IdentityDetails-title">
                <h1>
                  Update my password
                </h1>
              </div>
            </div>
            {menu}
           
            <div className="form">
              <FormGroup>
                  <div className="form-label">Login - </div>
                  <div className="form-input">
                      <FormControl
                        input = 'text'
                        value = {this.state.login}
                        onChange = {this.updateLogin}
                      />
                  </div>
              </FormGroup>

              <FormGroup>
                  <div className="form-label"> Enter current password - </div>
                  <div className="form-input">
                      <FormControl
                        input = 'text'
                        value = {this.state.oldPassword}
                        onChange = {this.updateOldPassword}
                      />
                  </div>
              </FormGroup>

              <FormGroup>
                  <div className="form-label"> Enter new password - </div>
                  <div className="form-input">
                      <FormControl
                        input = 'text'
                        value = {this.state.newPassword}
                        onChange = {this.updateNewPassword}
                      />
                  </div>
              </FormGroup>        

              <Button onClick={this.modifyPasswordInBlockchain} className="button-generateCertification">
                  Update my password
              </Button>


            </div>
            
          </div>
        );
    }      

}
export default UpdateMyPassword;