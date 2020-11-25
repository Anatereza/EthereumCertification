import React, { Component } from "react";
import CivilStateContract from "../contracts/CivilState.json";
import getWeb3 from "../getWeb3";

import "../App.css"

import NavigationHospital from './NavigationHospital';
import NavigationPrefecture from './NavigationPrefecture';
import NavigationCityHall from './NavigationCityHall';
import Navigation from './Navigation';

class Home extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      CivilStateInstance: undefined,
      account: null,
      web3: null,
      isOwner: false,
      isHospital: false,
      isPrefecture: false,
      isCityHall: false
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

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
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

      // Get the value from the contract to prove it worked.
      let hospitalAddr = await this.state.CivilStateInstance.methods.getHospital().call();

      // Update state with the result.
      this.setState({ hospital: hospitalAddr });

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
    return (
      <div className="App">
        <div className="IdentityDetails">
          <div className="IdentityDetails-title">
            <h1>
              PORTAL
            </h1>
          </div>
        </div>
        {menu}
       

        <div className="home">
          WELCOME TO IDENTITY SYSTEM
          <div>
          Made by BE
          </div>

          <div>
          Your user is {this.state.account} and the hospital address is {this.state.hospital}
          </div>          

          {this.state.isHospital ?
          <div> Yes you are the hospital</div> :
          <div> No you are not the HOSPITAL</div>
          }
        </div>

        
      </div>
    );
  }
}

export default Home;
