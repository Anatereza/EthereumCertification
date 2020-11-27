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

      // Set web3, accounts, and contract to the state
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
              IDENTITY SYSTEM PORTAL
            </h1>
          </div>
        </div>
        {menu}
       

        <div className="home">
          WELCOME TO THE IDENTITY SYSTEM
          
          <div>
          Made by Ana Tereza Mascarenhas
          </div>

          <div>
          Your user is {this.state.account}
          </div>          

          {this.state.isAdmin ?
          <div> You are the admin</div> :
          <div> Start exploring ! </div>
          }

          {this.state.isHospital ?
          <div> You are a member of the hospital</div> :
          <div> You are not a member of the hospital </div>
          }

          {this.state.isPrefecture ?
          <div> You are a member of the prefecture</div> :
          <div> You are not a member of the prefecture </div>
          } 

          {this.state.isCityHall ?
          <div> You are a member of the city hall</div> :
          <div> You are not a member of the city hall</div>
          } 
        </div>

        
      </div>
    );
  }
}

export default Home;
