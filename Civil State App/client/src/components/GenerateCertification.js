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


class GenerateCertification extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
          CivilStateInstance: undefined,
          account: null,
          web3: null,
          login :'',
          password : '',
          certificationHash: null,
          isAdmin: false,
          isHospital: false,
          isPrefecture: false,
          isCityHall: false,
        }
    
    }

    
    updateLogin = event => {
        this.setState({ login : event.target.value});
    }

    updatePassword = event => {
        this.setState({ password : event.target.value});
    }    

    getCertification =  async() =>  {
      const hash = await  this.state.CivilStateInstance.methods.getCertification(this.state.login).call();
      this.setState({certificationHash : hash});
    }

    generateCertificationInBlockchain = async() =>  {
      try {  
        // generateIdCertification (string memory login, string memory pwd)  
        await this.state.CivilStateInstance.methods.generateIdCertification(
              this.state.login,
              this.state.password)
              .send({
                  from : this.state.account,
                  gas: 1000000
              })
        alert('A certification was generated');
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
                  Generate identity certification
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
                  <div className="form-label">Password - </div>
                  <div className="form-input">
                      <FormControl
                        input = 'text'
                        value = {this.state.password}
                        onChange = {this.updatePassword}
                      />
                  </div>
              </FormGroup>     

              <Button onClick={this.generateCertificationInBlockchain} className="button-generateCertification">
                  Generate certification
              </Button>


            </div>

            <div>
                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            </div>
            
            <div className="result">
              <Button onClick={this.getCertification} className="button-getCertification">
                  Show certification
              </Button>
            
              <div>
                 You just generated the following certification : 
              </div> 

              <div>
                 Certification hash : {this.state.certificationHash}
              </div>  

            </div>
          </div>
        );
    }      

}
export default GenerateCertification;