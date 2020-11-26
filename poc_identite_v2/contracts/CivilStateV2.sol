// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;

    /*
        The CivilState contract keeps track of the citizen information, starting from their birth and being maintained throughout their life
     */
contract CivilStateV2 {

    /*
        Public owner variable => the creator of the contract when it is initialized.
    */
    address payable public owner;

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

    struct Authentification {
        string login;
        string password;
        string name;
    }
    
    /*
        Mapping to keep track of the hospital members
    */
    mapping (address => Authentification) hospitalMembers;

    /*
        Mapping to keep track of the prefecture members
    */
    mapping (address => Authentification) prefectureMembers;

    /*
        Mapping to keep track of the city hall members
    */
    mapping (address => Authentification) cityHallMembers;

    /*
       Mapping to keep track of the births (civil status).
       The mapping key is an integer, the value is an Birth struct.
    */
    mapping (uint => Birth) births;
    uint birthsCount = 0;

    mapping (uint => Identity) identities;
    uint identitiesCount = 0;

    /*
        Mapping to keep track of citizen's identifiers
    */
    mapping(string => Identifier) citizenIdentifiers;

    /*
        Mapping to keep track of identity certifications
    */
    mapping(bytes32 => Identifier) idCertifications;

    // Events

    // Event signaling that new hospital member was added
    event LogEventAddHospitalMember(string memberName);
    // Event signaling that new prefecture member was added
    event LogEventAddPrefectureMember(string memberName);
    // Event signaling that new cityHall member was added
    event LogEventAddCityHallMember(string memberName);
    // Event signaling that new birth member was declared
    event LogEventBirthAdded (string name, string lastName, uint birthId);
    // Event signaling that a new identity was verified
    event LogEventVerifyIdentity(uint birthId, uint identityId);
    // Event signaling that new marriage member was declared
    event LogEventDeclareMarriage(string marriageDate, uint identityId);


    /*
       Modifier that throws an error if the msg.sender is not the owner.
    */
    modifier isAdmin () {
        require(owner == msg.sender);
        _;
    }

    modifier isHospital (address _hospitalMember) {
        require (bytes(hospitalMembers[_hospitalMember].name).length > 0);
        _;
    }

    modifier isPrefecture (address _prefectureMember) {
        require (bytes(prefectureMembers[_prefectureMember].name).length > 0);
        _;
    }

    modifier isCityHall (address _cityHallMember) {
        require (bytes(cityHallMembers[_cityHallMember].name).length > 0);
        _;
    }

    constructor () public {
        owner = msg.sender;
    }
    
    // Help functions 

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
    
    // Admin functions

    // Add a new hospital member to the "hospitalMembers" mapping
    function addHospitalMember (address _newMember, string memory _memberName) public isAdmin {
        // Initialization of login and password
        string memory _login = concatenate("login_", _memberName);
        string memory _password = concatenate("pwd_", _memberName);
        hospitalMembers[_newMember] = Authentification({
            login : _login,
            password : _password,
            name : _memberName
        });
        emit LogEventAddHospitalMember(_memberName);
    }

    // Add a new prefecture member to the "prefectureMembers" mapping
    function addPrefectureMember (address _newMember, string memory _memberName) public isAdmin {
        // Initialization of login and password
        string memory _login = concatenate("login_", _memberName);
        string memory _password = concatenate("pwd_", _memberName);
        prefectureMembers[_newMember] = Authentification({
            login : _login,
            password : _password,
            name : _memberName
        });
        emit LogEventAddPrefectureMember(_memberName);
    }

    // Add a new city hall member to the "cityHallMembers" mapping
    function addCityHallMember (address _newMember, string memory _memberName) public isAdmin {
        // Initialization of login and password
        string memory _login = concatenate("login_", _memberName);
        string memory _password = concatenate("pwd_", _memberName);
        cityHallMembers[_newMember] = Authentification({
            login : _login,
            password : _password,
            name : _memberName
        });
        emit LogEventAddCityHallMember(_memberName);
    }

    /*
        When there is a birth, a member of the hospital must declare the birth : this function creates a new birth
        Only a hospital member can create a new birth
    */      
    function addBirth (string memory _name, string memory _lastName, string memory _birthDate, string memory _birthCity) public isHospital(msg.sender) returns(uint) {
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

    // get the birthId after a birth add
    function getBirthId () public view returns (uint _birthId, string memory _name, string memory _lastName){
        _name = "undefined";
        _lastName = "undefined";
        if (birthsCount >= 0) {
            _birthId = birthsCount - 1;
            _name = births[_birthId].name;
            _lastName = births[_birthId].lastName;
        }    
    }
    
    /*
        After a birth declaration, the a member of the prefecture must verifiy the citizen's identity
    */
    function createIdentity (uint birthId) public isPrefecture(msg.sender) returns (uint identityId) {
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

        citizenIdentifiers[login] = Identifier({
            userIdentityCount : identityId,
            userPassword : password
        });

        emit LogEventVerifyIdentity(birthId, identityId);
    }

    function getIdentityId() public view returns (uint _identity, string memory _name, string memory _lastName){
        _name = "undefined";
        _lastName = "undefined";
        if (identitiesCount >= 0) {
            _identity = identitiesCount - 1;
            _name = identities[_identity].birthinfo.name;
            _lastName = identities[_identity].birthinfo.lastName;            
        } 
    }

    /*
        Declare a marriage
        Only a city Hall member can declare a message
    */
    function declareMarriage (uint identityId, string memory _marriageDate) public isCityHall(msg.sender) {
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
        require (keccak256(bytes(citizenIdentifiers[login].userPassword)) == keccak256(bytes(pwd)));
        // Get the user identity count
        uint userIdCount = citizenIdentifiers[login].userIdentityCount;
        string memory userIdCountString = uintToString(userIdCount);
        string memory contIdentifiers = concatenate(userIdCountString, pwd);
        bytes32 identity_hash = keccak256(bytes(contIdentifiers));
        // add certification to mapping
        idCertifications[identity_hash] = citizenIdentifiers[login];
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
        uint userIdCount = idCertifications[id_hash].userIdentityCount;
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

    function isHospitalMember() public view returns(bool isMember){
        if (bytes(hospitalMembers[msg.sender].name).length > 0) {
            isMember = true;
        } else {
            isMember = false;
        }
    }

    function isPrefectureMember() public view returns(bool isMember){
        if (bytes(prefectureMembers[msg.sender].name).length > 0) {
            isMember = true;
        } else {
            isMember = false;
        }
    }

    function isCityHallisPrefectureMember() public view returns(bool isMember){
        if (bytes(cityHallMembers[msg.sender].name).length > 0) {
            isMember = true;
        } else {
            isMember = false;
        }
    }

}