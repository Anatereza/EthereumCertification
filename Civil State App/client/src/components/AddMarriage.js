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


class AddMarriage extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
          CivilStateInstance: undefined,
          account: null,
          web3: null,
          name :'',
          lastName : '',
          maritalStatus : '',
          marriageDate: '',
          isAdmin: false,
          isHospital: false,
          isPrefecture: false,
          isCityHall: false,
          birthId: null,
          identityId: null,
          marriageId: null,
          singleIdentityList: []
        }
    
    }

    
    updateMarriageDate = event => {
        this.setState({ marriageDate : event.target.value});
    }


    addMarriageToBlockchain = param => async () => {
        //declareMarriage (uint identityId, string memory _marriageDate)
        try {  
        await this.state.CivilStateInstance.methods.declareMarriage(param, this.state.marriageDate).send({
                  from : this.state.account,
                  gas: 1000000
              })      
           
        alert('An identity verification was submitted');

      } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
          }  
    }

    constructSingleIdentityList = async () => {
        const identitiesCountBlockchain = await this.state.CivilStateInstance.methods.getIdentitiesCount().call({from : this.state.account});
        for (let i = 0; i < identitiesCountBlockchain; i++) {
            // readIdentity(uint identityId)
            //returns(string memory _name, string memory _lastName, string memory _birthDate, string memory _birthCity, string memory _maritalStatus)
            const response = await this.state.CivilStateInstance.methods.readIdentity(i).call({from : this.state.account});
            const _name = response[0];
            const _lastName = response[1];
            const _birthDate = response[2];
            const _birthCity = response[3];
            const _maritalStatus = response[4];
            if (_maritalStatus === 'single') {
                const newSingleIdentity = {name : _name, lastName : _lastName, birthDate: _birthDate, birthCity : _birthCity, maritalStatus : _maritalStatus, marriageId: i}
                this.setState({singleIdentityList : [...this.state.singleIdentityList, newSingleIdentity]});
            }    
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
          
          // Construct list of identities that are single
          this.constructSingleIdentityList();         
          
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

        if (!this.state.web3) {      
            return (
              <div className="IdentityDetails">
                  <div className="IdentityDetails-title">
                    <h1>
                      ONLY PREFECTURE CAN ACCESS
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
                  DECLARE MARRIAGE
                </h1>
              </div>
            </div>
            {menu}

            <div className="IdentitiesToMarry">
                <div className="IdentitiesToMarry-title">
                  <h1>
                    List of identities not married
                  </h1>
                </div>

                <div>
                  <h1>
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                  </h1>
                </div>

                <FormGroup>
                  <div className="form-label">Enter marriage date - </div>
                    <div className="form-input">
                      <FormControl
                        input = 'text'
                        value = {this.state.marriageDate}
                        onChange = {this.updateMarriageDate}
                       />
                  </div>
                </FormGroup>                
                
                <div>
                  <h1>
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                  </h1>
                </div>

                {this.state.singleIdentityList.map((data) => (
                    <p>
                       <p>Name : {data.name}</p>
                       <p>Last name : {data.lastName}</p>
                       <p>Marital status : {data.maritalStatus}</p>                
                       <p>
                            <Button onClick={this.addMarriageToBlockchain(data.marriageId)} className="button-addMarriage">
                                Declare marriage
                            </Button>
                       </p>
                    </p>
                ))}
            </div>
            

          </div>
        );
    }      

}
export default AddMarriage;