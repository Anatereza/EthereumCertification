import React, { Component } from "react";
import CivilStateContract from "../contracts/CivilState.json";
import getWeb3 from "../getWeb3";

import NavigationAdmin from './NavigationAdmin';
import NavigationHospital from './NavigationHospital';
import NavigationPrefecture from './NavigationPrefecture';
import NavigationCityHall from './NavigationCityHall';
import Navigation from './Navigation';


class BirthDetails extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
          CivilStateInstance: undefined,
          account: null,
          web3: null,
          name :'',
          lastName : '',
          birthDate: '',
          birthCity: '',
          verification: '',
          isAdmin: false,
          isHospital: false,
          isPrefecture: false,
          isCityHall: false,
          birthId: null,
          identityId: null,
          verifiedBirthList: [],
          toVerifyBirthList: []
        }
    
    }

    contructBirthList = async () => {
      const birthCountBlockchain = await this.state.CivilStateInstance.methods.getBirthsCount().call({from : this.state.account});
        for (let i = 0; i < birthCountBlockchain; i++) {
          //  readBirth(uint birthId) 
          //returns(string memory _name, string memory _lastName, string memory _birthDate, string memory _birthCity, bool _isVerified)
          const response = await this.state.CivilStateInstance.methods.readBirth(i).call({from : this.state.account});
          const _name = response[0];
          const _lastName = response[1];
          const _birthDate = response[2];
          const _birthCity = response[3];
          //const _isVerified = true | false;
          const _isVerified = response[4];
          // eslint-disable-next-line
          let _verification = '';
          if (!_isVerified) {
            // eslint-disable-next-line
            _verification = 'To verify';
            const toVerifyBirth = {name : _name, lastName : _lastName, birthDate: _birthDate, birthCity : _birthCity, verification : _verification}
            this.setState({toVerifyBirthList : [...this.state.toVerifyBirthList, toVerifyBirth]});
          } else {
            // eslint-disable-next-line
            _verification = 'Verified';
            const verifiedBirth = {name : _name, lastName : _lastName, birthDate: _birthDate, birthCity : _birthCity, verification : _verification}
            this.setState({verifiedBirthList : [...this.state.verifiedBirthList, verifiedBirth]});            
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

          // Construct list of births
          this.contructBirthList();

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

            <div className="BirthDetails">
              <div className="BirthDetails-title">
                <h1>
                  VIEW BIRTHS
                </h1>
              </div>
            </div>
            {menu}
           
            <div className="BirthsToVerify">
                <div className="BirthsToVerify-title">
                  <h1>
                    Births to verify
                  </h1>
                </div>
                
                {this.state.toVerifyBirthList.map((data) => (
                    <p>
                       <p>Name : {data.name}</p>
                       <p>Last name : {data.lastName}</p>
                       <p>Birth date : {data.birthDate}</p>
                       <p>Birth city : {data.birthCity}</p>
                       <p>Birth status : {data.verification}</p>                    
                       <p> --- --- --- ---</p>
                       <p>                </p>
                    </p>
                ))}
            </div>
         
            <div className="BirthsVerified">
                <div className="BirthsVerified-title">
                  <h1>
                    Verified births
                  </h1>
                </div>
                
                {this.state.verifiedBirthList.map((data) => (
                    <p>
                       <p>Name : {data.name}</p>
                       <p>Last name : {data.lastName}</p>
                       <p>Birth date : {data.birthDate}</p>
                       <p>Birth city : {data.birthCity}</p>
                       <p>Birth status : {data.verification}</p> 
                       <p> --- --- --- ---</p>
                       <p>                </p>                    
                    </p>
                ))}
            </div>


          </div>



        );
    }      

}
export default BirthDetails;