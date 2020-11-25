import React, { Component } from "react";
import CivilStateContract from "../contracts/CivilState.json";
import getWeb3 from "../getWeb3";

// FormGroup to take input from user
import { FormGroup, FormControl, Button } from 'react-bootstrap';

import NavigationHospital from './NavigationHospital';
import NavigationPrefecture from './NavigationPrefecture';
import NavigationCityHall from './NavigationCityHall';
import Navigation from './Navigation';


class VerifyIdentity extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
          CivilStateInstance: undefined,
          account: null,
          web3: null,
          name :'',
          lastName : '',
          birthDate : '',
          birthCity : '',
          isOwner: false,
          isHospital: false,
          isPrefecture: false,
          isCityHall: false,
          birthId: null,
          identityId: null
        }
    
    }

    
    updateIdentity = event => {
        this.setState({ birthId : event.target.value});
    }

    getIdentityId =  async() =>  {
      const res = await  this.state.CivilStateInstance.methods.getIdentityId().call();
      const id_identity = res[0];
      const _name = res[1];
      this.setState({birthId : id_identity});
      this.setState({name : _name});
      //window.location.reload(false);
    }

    addIdentityToBlockchain = async() =>  {
      try {  
        await this.state.CivilStateInstance.methods.createIdentity(this.state.birthId).send({
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
              this.setState({isOwner : true});
          }

          const hospital = await this.state.CivilStateInstance.methods.getHospital().call();
          if (this.state.account === hospital) {
              this.setState({isHospital : true});
          }

          const prefecture = await this.state.CivilStateInstance.methods.getPrefecture().call();
          if (this.state.account === prefecture) {
              this.setState({isPrefecture : true});
          }

          const cityHall = await this.state.CivilStateInstance.methods.getCityHall().call();
          if (this.state.account === cityHall) {
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
        if (this.state.isHospital) {
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
                  Verify identity
                </h1>
              </div>
            </div>
            {menu}
           
            <div className="form">
              <FormGroup>
                  <div className="form-label">Enter birth id to verify - </div>
                  <div className="form-input">
                      <FormControl
                        input = 'text'
                        value = {this.state.idenityId}
                        onChange = {this.updateIdentity}
                      />
                  </div>
              </FormGroup>
    

              <Button onClick={this.addIdentityToBlockchain} className="button-addidentity">
                  Verify identity
              </Button>


            </div>
            
            <div className="result">
              <Button onClick={this.getIdentityId} className="button-birthId">
                  Show identity id
              </Button>

              <div>
                Your identity id is {this.state.identityId}
                Your identity name is {this.state.name}
              </div>

            </div>
          </div>
        );
    }      

}
export default VerifyIdentity;