// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;

    /*
        The CivilState contract keeps track of the citizen information, starting from their birth and being maintained throughout their life
     */
contract CivilState {

    /*
        Define an public owner variable. Set it to the creator of the contract when it is initialized.
        Define a variable for each possible modifier
    */
    address payable public owner;
    address public hospital;
    address public prefecture;
    address public cityHall;

    /*
        Birth struct : add birth information
    */
    struct Birth {
        string name;
        string lastName;
        // Date format : YYYYMMDD
        string birthDate;
        string birthCity;
        bool isVerified;
    }

    /*
        Define an Identity struct.
    */
    struct Identity {
        Birth birthinfo;
        
        // Marital information
        string maritalStatus;
        string marriageDate;
       
        string deathDate;

        string userLogin;
        string userPassword;
    }

    /*
        Struct to track users identifiers
    */
    struct Identifier {
        uint userIdentityCount;
        string userPassword;
    }


    /*
       Mapping to keep track of the births (civil status).
       The mapping key is an integer, the value is an Birth struct.
    */
    mapping (uint => Birth) births;
    uint birthsCount = 0;

    mapping (uint => Identity) identities;
    uint identitiesCount = 0;

    /*
        Mapping to keep track of users identifiers
    */
    mapping(string => Identifier) identifiers;

    /*
        Mapping to keep track of identity certifications
    */
    mapping(bytes32 => Identifier) certifications;

    // Events
    event LogEventBirthAdded (string name, string lastName, uint birthId);
    event LogEventVerifyIdentity(uint birthId, uint identityId);
    event LogEventDeclareMarriage(string marriageDate, uint identityId);


    /*
       Modifier that throws an error if the msg.sender is not the owner.
    */
    modifier isOwner () {
        require(owner == msg.sender);
        _;
    }

    modifier isHospital () {
        require (hospital == msg.sender);
        _;
    }

    modifier isPrefecture () {
        require (prefecture == msg.sender);
        _;
    }

    modifier isCityHall () {
        require (cityHall == msg.sender);
        _;
    }        

    constructor (address _hospital, address _prefecture, address _cityHall) public {
        owner = msg.sender;
        hospital = _hospital;
        prefecture = _prefecture;
        cityHall = _cityHall;
    }
    
    // Concatenate strings
    function concatenate(string memory a, string  memory b) public pure returns(string memory) {
            return string(abi.encodePacked(a, b));
    }

    // Function to transform uint to string
    function uintToString(uint v) public pure returns (string memory str) {
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = byte(uint8(48 + remainder));
        }
        bytes memory s = new bytes(i + 1);
        for (uint j = 0; j <= i; j++) {
            s[j] = reversed[i - j];
        }
        str = string(s);
    }
    
    /*
        When there is a birth, the hospital must declare the birth : this function creates a new birth
        Only the hospital can create a new birth
    */      
    function addBirth (string memory _name, string memory _lastName, string memory _birthDate, string memory _birthCity) public isHospital returns(uint) {
        uint birthId = birthsCount++;
        births[birthId] = Birth({
            name : _name,
            lastName : _lastName,
            birthDate : _birthDate,
            birthCity : _birthCity,
            isVerified : false
        });
        emit LogEventBirthAdded(_name, _lastName, birthId);
        return birthId;
    }

    // ger the birthId after a birth add
    function getBirthId () public view returns (uint){
        uint birth_id;
        if (birthsCount >= 0) {
            birth_id = birthsCount - 1;
        }    
        return birth_id;
    }
    
    /*
        After a birth declaration, the prefecture must verifiy the citizen's identity
    */
    function createIdentity (uint birthId) public isPrefecture returns (uint identityId) {
        require(births[birthId].isVerified == false);
        births[birthId].isVerified = true;
        
        // Initialization of login and password
        string memory login = concatenate("login_", births[birthId].lastName);
        string memory password = concatenate("pwd_", births[birthId].birthDate);


        identityId = identitiesCount++;
        identities[identityId] = Identity({
            birthinfo : births[birthId],
            maritalStatus : "single",
            marriageDate: "",
            deathDate: "",
            userLogin: login,
            userPassword: password
        });

        identifiers[login] = Identifier({
            userIdentityCount : identityId,
            userPassword : password
        });

        emit LogEventVerifyIdentity(birthId, identityId);
    }

    function getIdentityId() public view returns (uint _identity, string memory _test){
        uint identity_id;
        if (identitiesCount >= 0) {
            identity_id = identitiesCount - 1;
        }    
        return (identity_id, "test");
    }

    /*
        Declare a marriage
        Only City Hall can declare a message
    */
    function declareMarriage (uint identityId, string memory _marriageDate) public isCityHall {
        require(identities[identityId].birthinfo.isVerified == true);
        
        //Change marital status
        identities[identityId].maritalStatus = "married";
        identities[identityId].marriageDate = _marriageDate;

        emit LogEventDeclareMarriage(_marriageDate, identityId);
    
    }

    /*
        Function to allow citizen to generete an identity certification
    */
    function generateIdCertification (string memory login, string memory pwd) public returns (bytes32){
        //Verify that the user used the good password
        require (keccak256(bytes(identifiers[login].userPassword)) == keccak256(bytes(pwd)));
        // Get the user identity count
        uint userIdCount = identifiers[login].userIdentityCount;
        string memory userIdCountString = uintToString(userIdCount);
        string memory contIdentifiers = concatenate(userIdCountString, pwd);
        bytes32 identity_hash = keccak256(bytes(contIdentifiers));
        // add certification to mapping
        certifications[identity_hash] = identifiers[login];
        return identity_hash;
    }
    

    /*
       Functions read
    */

    /*
        Function to verify identityCertification
    */

    function verifyCertification (bytes32 id_hash) public view returns (string memory _name, string memory _lastName, string memory _birthDate, string memory _birthCity, string memory _maritalStatus) {
        // get userIdCount
        uint userIdCount = certifications[id_hash].userIdentityCount;
        return(identities[userIdCount].birthinfo.name, identities[userIdCount].birthinfo.lastName, identities[userIdCount].birthinfo.birthDate, identities[userIdCount].birthinfo.birthCity, identities[userIdCount].maritalStatus);

    }
    
    function readBirth(uint birthId) public view returns(string memory _name, string memory _lastName, string memory _birthDate, string memory _birthCity, bool _isVerified){
        return (births[birthId].name, births[birthId].lastName, births[birthId].birthDate, births[birthId].birthCity, births[birthId].isVerified);
    }        

 
    function readIdentity(uint identityId) public view returns(string memory _name, string memory _lastName, string memory _birthDate, string memory _birthCity, string memory _maritalStatus){
        require(identities[identityId].birthinfo.isVerified == true);
        return (identities[identityId].birthinfo.name, identities[identityId].birthinfo.lastName, identities[identityId].birthinfo.birthDate, identities[identityId].birthinfo.birthCity, identities[identityId].maritalStatus);
    }

    function getBirthsCount() public view returns(uint _birthCount) {
        return birthsCount; 
    }

    function getIdentitiesCount() public view returns(uint _identitiesCount){
        return identitiesCount;
    }

    function getOwner() public view returns(address _owner){
        return owner;
    }

    function getHospital() public view returns(address _hospital){
        return hospital;
    }

    function getPrefecture() public view returns(address _prefecture){
        return prefecture;
    }

    function getCityHall() public view returns(address _cityHall) {
        return cityHall;
    }

}