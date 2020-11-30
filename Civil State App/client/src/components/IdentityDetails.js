import React, { Component } from "react";
import CivilStateContract from "../contracts/CivilState.json";
import getWeb3 from "../getWeb3";


import NavigationAdmin from './NavigationAdmin';
import NavigationHospital from './NavigationHospital';
import NavigationPrefecture from './NavigationPrefecture';
import NavigationCityHall from './NavigationCityHall';
import Navigation from './Navigation';


class IdentityDetails extends Component {
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
          maritalStatus: '',
          isAdmin: false,
          isHospital: false,
          isPrefecture: false,
          isCityHall: false,
          identitiesList: []
        }
    
    }

    contructIdentitiesList = async () => {
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
          const newIdentity = {name : _name, lastName : _lastName, birthDate: _birthDate, birthCity : _birthCity, maritalStatus : _maritalStatus}
          this.setState({identitiesList : [...this.state.identitiesList, newIdentity]});      
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

          // Construct list of identities
          this.contructIdentitiesList();

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
                  VIEW IDENTITIES DETAILS
                </h1>
              </div>
            </div>
            {menu}
           
         
            <div className="IdentitiesVerified">
                <div className="IdentitiesVerified-title">
                  <h1>
                    Verified identities
                  </h1>
                </div>
                
                {this.state.identitiesList.map((data) => (
                    <p>
                       <p>Name : {data.name}</p>
                       <p>Last name : {data.lastName}</p>
                       <p>Birth date : {data.birthDate}</p>
                       <p>Birth city : {data.birthCity}</p>
                       <p>Marital status : {data.maritalStatus}</p> 
                       <p> --- --- --- ---</p>
                       <p>                </p>                    
                    </p>
                ))}
            </div>


          </div>



        );
    }      

}
export default IdentityDetails;