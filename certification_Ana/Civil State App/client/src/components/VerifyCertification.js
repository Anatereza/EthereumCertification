import React, { Component} from "react";
import CivilStateContract from "../contracts/CivilState.json";
import getWeb3 from "../getWeb3";

// FormGroup to take input from user
import { FormGroup, FormControl, Button } from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import NavigationHospital from './NavigationHospital';
import NavigationPrefecture from './NavigationPrefecture';
import NavigationCityHall from './NavigationCityHall';
import Navigation from './Navigation';


class VerifyCertification extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
          CivilStateInstance: undefined,
          account: null,
          web3: null,
          name :'',
          lastName : '',
          birthCity : '',
          birthDate : '',       
          certificationHash: null,
          isAdmin: false,
          isHospital: false,
          isPrefecture: false,
          isCityHall: false
        }
    
    }
    
    updateHash = event => {
        this.setState({ certificationHash : event.target.value});
    }

    updateName = event => {
        this.setState({ name : event.target.value});
    } 

    updateLastName = event => {
        this.setState({ lastName : event.target.value});
    }
    
    updateBirthDate = event => {
        this.setState({ birthDate : event.target.value});
    }
    
    updateBirthCity = event => {
        this.setState({ birthCity : event.target.value});
    }    

    verifyCertificationInBlockchain =  async() =>  {
      try {
        // verifyCertification (bytes32 id_hash)
        // returns (string memory _name, string memory _lastName, string memory _birthDate, string memory _birthCity, string memory _maritalStatus)  
        const response = await  this.state.CivilStateInstance.methods.verifyCertification(this.state.certificationHash).call();
        const _name = response[0];
        const _lastName = response[1];
        const _birthDate = response[2];
        const _birthCity = response[3];
        this.setState({name : _name, lastName : _lastName, birthDate : _birthDate, birthCity : _birthCity});
        alert('The certification verifies');
    } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Certification verification failed`,
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
                  Verify identity certification
                </h1>
              </div>
            </div>
            {menu}
           
            <div className="form">
              <FormGroup>
                  <div className="form-label">Enter certification hash - </div>
                  <div className="form-input">
                      <FormControl
                        input = 'text'
                        value = {this.state.certificationHash}
                        onChange = {this.updateHash}
                      />
                  </div>
              </FormGroup>

              <Button onClick={this.verifyCertificationInBlockchain} className="button-verifyCertification">
                  Verify certification
              </Button>


            </div>
            
            <div>
                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            </div>

            <div className="result">
          
              <div>
                 Citizen name : {this.state.name}
              </div>
              
              <div>
                 Citizen last name : {this.state.lastName}
              </div>

              <div>
                 Citizen birth date : {this.state.birthDate}
              </div>                                 

              <div>
                 Citizen birth city : {this.state.birthCity}
              </div>

            </div>
          </div>
        );
    }      

}
export default VerifyCertification;