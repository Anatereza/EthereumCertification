import React, { Component } from "react";
import CivilStateContractV2 from "../contracts/CivilStateV2.json";
import getWeb3 from "../getWeb3";

import "../App.css"

import NavigationAdmin from './NavigationAdmin';
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
      owner: null,
      hospitalMemberName: '',
      isAdmin: false,
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
      const deployedNetwork = CivilStateContractV2.networks[networkId];
      const instance = new web3.eth.Contract(
        CivilStateContractV2.abi, 
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // account[0] = default account used by metamask
      this.setState({ CivilStateInstance: instance, web3: web3, account: accounts[0] });

      //Verify if hospital, prefecture, city hall or citizen
      const owner = await this.state.CivilStateInstance.methods.getOwner().call();
      if (this.state.account === owner) {
        this.setState({isAdmin : true});
      }

      this.setState({owner : owner});

      const hospitalMember = await this.state.CivilStateInstance.methods.isHospitalMember().call();
      if (this.state.account === hospitalMember) {
        this.setState({isHospital : true});
      }
            
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
          Made by Ana Tereza Mascarenhas
          </div>

          <div>
          Your user is {this.state.account}
          The owner is {this.state.owner}
          Are you a hospital member ? {this.state.isHospital} MY ANWSER
          Are you admin ? {this.state.isAdmin} MY ANSWER
          </div>          

          {this.state.isAdmin ?
          <div> You are the admin</div> :
          <div> Start exploring ! </div>
          }

          {this.state.isHospital ?
          <div> You are the hospital</div> :
          <div> You are not the hospital </div>
          }
        </div>

        
      </div>
    );
  }
}

export default Home;
