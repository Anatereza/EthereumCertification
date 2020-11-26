import React, { Component } from "react";
import CivilStateContractV2 from "../contracts/CivilStateV2.json";
import getWeb3 from "../getWeb3";

// FormGroup to take input from user
import { FormGroup, FormControl, Button } from 'react-bootstrap';

import NavigationAdmin from './NavigationAdmin';
import NavigationHospital from './NavigationHospital';
import NavigationPrefecture from './NavigationPrefecture';
import NavigationCityHall from './NavigationCityHall';
import Navigation from './Navigation';


class AddHospitalMember extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
          CivilStateInstance: undefined,
          account: null,
          web3: null,
          newMember : null,
          memberName : null,
          name : null,
          address: null,
          isAdmin: false,
          isHospital: false,
          isPrefecture: false,
          isCityHall: false
        }
    
    }

    
    updateMember = event => {
        this.setState({ newMember : event.target.value});
    }

    updateMemberName = event => {
        this.setState({ memberName : event.target.value});
    }

    updateAddress = event => {
        this.setState({address : event.target.value});
    }
    
    
    checkHospitalMemberFromBlockchain =  async() =>  {
      const _name = await  this.state.CivilStateInstance.methods.getHospitalMemberName(this.state.address).call();
      this.setState({name : _name});
    }

    addHospitalMemberToBlockchain = async() =>  {
      try {  
        // addHospitalMember (address _newMember, string memory _memberName)
        await this.state.CivilStateInstance.methods.addHospitalMember(
              this.state.newMember,
              this.state.memberName)
              .send({
                  from : this.state.account,
                  gas: 1000000
              })
        alert('A hospital member was added');
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
          const deployedNetwork = CivilStateContractV2.networks[networkId];
          const instance = new web3.eth.Contract(
              CivilStateContractV2.abi, 
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

          // eslint-disable-next-line
          const hospitalMember = await this.state.CivilStateInstance.methods.isHospitalMember().call();
          this.setState({isHospital : hospitalMember});
          
          /*
          const prefectureMember = await this.state.CivilStateInstance.methods.isPrefectureMember().call();
          if (prefectureMember === true) {
            this.setState({isPrefecture : true});
          }

          const cityHallMember = await this.state.CivilStateInstance.methods.isCityHallMember().call();
          if (cityHallMember == true) {
            this.setState({isCityHall : true});
          }*/      
    
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
                      ONLY ADMIN CAN ACCESS
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
                  Add hospital member
                </h1>
              </div>
            </div>
            {menu}
           
            <div className="form">
              <FormGroup>
                  <div className="form-label">Enter hospital member name - </div>
                  <div className="form-input">
                      <FormControl
                        input = 'text'
                        value = {this.state.memberName}
                        onChange = {this.updateMemberName}
                      />
                  </div>
              </FormGroup>

              <FormGroup>
                  <div className="form-label">Enter member Ethereum address - </div>
                  <div className="form-input">
                      <FormControl
                        input = 'text'
                        value = {this.state.newMember}
                        onChange = {this.updateMember}
                      />
                  </div>
              </FormGroup>



              <Button onClick={this.addHospitalMemberToBlockchain} className="button-addbirth">
                  Add hospital member
              </Button>
            </div>

            <div className="form2">
              <FormGroup>
                  <div className="form-label">Enter hospital address to check - </div>
                  <div className="form-input">
                      <FormControl
                        input = 'text'
                        value = {this.state.address}
                        onChange = {this.updateAddress}
                      />
                  </div>
              </FormGroup>

              <Button onClick={this.checkHospitalMemberFromBlockchain} className="button-verifyHospitalMember">
                  Check hospital member
              </Button>
            </div>

            <div>
              The hospital member name is {this.state.name}
            </div>
            

          </div>
        );
    }      

}
export default AddHospitalMember;