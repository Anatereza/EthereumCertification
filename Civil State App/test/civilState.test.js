var CivilState = artifacts.require('CivilState')
let catchRevert = require("./exceptionsHelpers.js").catchRevert
const BN = web3.utils.BN

contract('CivilState', function(accounts) {

    const deployAccount = accounts[0]
    const hospitalMember = accounts[3]
    const prefectureMember = accounts[4]
    const cityHallMember = accounts[5]
    const citizen1 = accounts[6]
    const universityMember = accounts[8]


    let instance

    const citizenA = {
        name: "bob",
        lastName: "smith",
        birthDate: "20200101",
        birthCity: "New York"
    }


    beforeEach(async () => {
        instance = await CivilState.new()
    })

    describe("Setup", async() => {

        it("OWNER should be set to the deploying address", async() => {
            const owner = await instance.owner()
            assert.equal(owner, deployAccount, "the deploying address should be the owner")
        })
    })

    
    describe("Functions", () => {
        describe("addHospitalMember", async() => {
            it("only the owner should be able to add a hospital member", async() => {
                await instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: deployAccount} )
                await catchRevert(instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: citizen1}))
            })

            it("adding an hospital member should emit an event with the provided member details", async() => {
                const tx = await instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: deployAccount} )
                const eventData = tx.logs[0].args

                assert.equal(eventData.memberName, "hospitalMember1", "the added hospital member name should match")
            })            
            
        })

        describe("addPrefectureMember", async() => {
            it("only the owner should be able to add a prefecture member", async() => {
                await instance.addPrefectureMember(prefectureMember, "prefectureMember1", {from: deployAccount} )
                await catchRevert(instance.addPrefectureMember(prefectureMember, "prefectureMember1", {from: citizen1}))
            })

            it("adding an prefecture member should emit an event with the provided member details", async() => {
                const tx = await instance.addPrefectureMember(prefectureMember, "prefectureMember1", {from: deployAccount} )
                const eventData = tx.logs[0].args

                assert.equal(eventData.memberName, "prefectureMember1", "the added prefecture member name should match")
            })            
            
        })

        describe("addCityHallMember", async() => {
            it("only the owner should be able to add a cityHall member", async() => {
                await instance.addCityHallMember(cityHallMember, "cityHallMember1", {from: deployAccount} )
                await catchRevert(instance.addCityHallMember(cityHallMember, "cityHallMember1", {from: citizen1}))
            })

            it("adding an cityHall member should emit an event with the provided member details", async() => {
                const tx = await instance.addCityHallMember(cityHallMember, "cityHallMember1", {from: deployAccount} )
                const eventData = tx.logs[0].args

                assert.equal(eventData.memberName, "cityHallMember1", "the added cityHall member name should match")
            })            
            
        })        

        describe("addBirth", async() => {
            it("only the a hospital member should be able to add a new birth", async() => {
                await instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: deployAccount} )
                await catchRevert(instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: citizen1}))

                await instance.addBirth(citizenA.name, citizenA.lastName, citizenA.birthDate, citizenA.birthCity, {from: hospitalMember} )
                await catchRevert(instance.addBirth(citizenA.name, citizenA.lastName, citizenA.birthDate, citizenA.birthCity, {from: citizen1} ))

            })

            it("adding a birth should emit an event with the provided birth details", async() => {
                await instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: deployAccount} )
                await catchRevert(instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: citizen1}))

                // event LogEventBirthAdded (string name, string lastName, uint birthId);
                const tx = await instance.addBirth(citizenA.name, citizenA.lastName, citizenA.birthDate, citizenA.birthCity, {from: hospitalMember} )
                const eventData = tx.logs[0].args

                assert.equal(eventData.name, citizenA.name, "the birth name should match")
                assert.equal(eventData.lastName, citizenA.lastName, "the birth lastname name should match")
            })      
         
        })        

        describe("verifyIdentity", async() => {
            it("only the a prefecture member should be able to verify a identity", async() => {
                await instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: deployAccount} )
                await catchRevert(instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: citizen1}))

                await instance.addPrefectureMember(prefectureMember, "prefectureMember1", {from: deployAccount} )
                await catchRevert(instance.addPrefectureMember(prefectureMember, "prefectureMember1", {from: citizen1}))

                await instance.addBirth(citizenA.name, citizenA.lastName, citizenA.birthDate, citizenA.birthCity, {from: hospitalMember} )
                await catchRevert(instance.addBirth(citizenA.name, citizenA.lastName, citizenA.birthDate, citizenA.birthCity, {from: citizen1} ))

                await instance.verifyIdentity(0, {from: prefectureMember} )
                await catchRevert(instance.verifyIdentity(0, {from: citizen1} ))
            })

            it("verifying an identity should emit an event with the identityId", async() => {
                await instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: deployAccount} )
                await catchRevert(instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: citizen1}))

                await instance.addPrefectureMember(prefectureMember, "prefectureMember1", {from: deployAccount} )
                await catchRevert(instance.addPrefectureMember(prefectureMember, "prefectureMember1", {from: citizen1}))
                
                // emit LogEventVerifyIdentity(birthId, identityId);
                // event LogEventBirthAdded (string name, string lastName, uint birthId);
                await instance.addBirth(citizenA.name, citizenA.lastName, citizenA.birthDate, citizenA.birthCity, {from: hospitalMember} )
                const tx = await instance.verifyIdentity(0, {from: prefectureMember} )
                const eventData = tx.logs[0].args

                assert.equal(eventData.birthId, 0, "the birth id should be 0")
                assert.equal(eventData.identityId, 0, "the identityId should be 0")
            })      
         
        })      

       
        describe("generateIdCertification", async() => {
                it("a citizen should be able to generate a certification", async() => {
                    await instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: deployAccount} )
                    await catchRevert(instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: citizen1}))
    
                    await instance.addPrefectureMember(prefectureMember, "prefectureMember1", {from: deployAccount} )
                    await catchRevert(instance.addPrefectureMember(prefectureMember, "prefectureMember1", {from: citizen1}))
    
                    await instance.addBirth(citizenA.name, citizenA.lastName, citizenA.birthDate, citizenA.birthCity, {from: hospitalMember} )
                    await catchRevert(instance.addBirth(citizenA.name, citizenA.lastName, citizenA.birthDate, citizenA.birthCity, {from: citizen1} ))
    
                    await instance.verifyIdentity(0, {from: prefectureMember} )
                    await catchRevert(instance.verifyIdentity(0, {from: citizen1} ))

                    // Once the identity is verified, the citizen should be able to generate a certificate
                    const login = "login_" + citizenA.lastName + citizenA.birthDate
                    const pwd = "pwd_" + citizenA.birthDate
                    await instance.generateIdCertification(login, pwd, {from: citizen1} )
                    await catchRevert(instance.generateIdCertification("login","pwd", {from: citizen1} ))
                })
    
                it("generating a certificate should emit an event with the certification hash", async() => {
                    await instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: deployAccount} )
                    await catchRevert(instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: citizen1}))
    
                    await instance.addPrefectureMember(prefectureMember, "prefectureMember1", {from: deployAccount} )
                    await catchRevert(instance.addPrefectureMember(prefectureMember, "prefectureMember1", {from: citizen1}))                  

                    //emit LogEventCertificationGenerated(login, identity_hash);
                    await instance.addBirth(citizenA.name, citizenA.lastName, citizenA.birthDate, citizenA.birthCity, {from: hospitalMember} )
                    await instance.verifyIdentity(0, {from: prefectureMember} )
                    const login = "login_" + citizenA.lastName + citizenA.birthDate
                    const pwd = "pwd_" + citizenA.birthDate                    
                    const tx = await instance.generateIdCertification(login, pwd, {from: citizen1} )
                    const eventData = tx.logs[0].args
    
                    assert.equal(eventData.login, login, "the login should match")
                })      
             
        })         

        // function verifyCertification (bytes32 id_hash) public view returns (string memory _name, string memory _lastName, string memory _birthDate, string memory _birthCity, string memory _maritalStatus) {
            describe("verifyCertification", async() => {
                it("from a certification hash the citizen information should be available", async() => {
                    await instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: deployAccount} )
                    await catchRevert(instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: citizen1}))
    
                    await instance.addPrefectureMember(prefectureMember, "prefectureMember1", {from: deployAccount} )
                    await catchRevert(instance.addPrefectureMember(prefectureMember, "prefectureMember1", {from: citizen1}))
    
                    await instance.addBirth(citizenA.name, citizenA.lastName, citizenA.birthDate, citizenA.birthCity, {from: hospitalMember} )
                    await catchRevert(instance.addBirth(citizenA.name, citizenA.lastName, citizenA.birthDate, citizenA.birthCity, {from: citizen1} ))
    
                    await instance.verifyIdentity(0, {from: prefectureMember} )
                    await catchRevert(instance.verifyIdentity(0, {from: citizen1} ))

                    // Once the identity is verified, the citizen should be able to generate a certificate
                    const login = "login_" + citizenA.lastName + citizenA.birthDate
                    const pwd = "pwd_" + citizenA.birthDate
                    const tx = await instance.generateIdCertification(login, pwd, {from: citizen1} )
                    await catchRevert(instance.generateIdCertification("login","pwd", {from: citizen1} ))
                    const eventData = tx.logs[0].args
                    const certificationHash = eventData.identity_hash    
                    
                    // Once a certification hash is verified, an university (for example) can check the citizen information
                    await instance.verifyCertification(certificationHash, {from: universityMember} )
                })
    
                it("verifying a certification should emit an event with citizen information", async() => {
                    await instance.addHospitalMember(hospitalMember, "hospitalMember1", {from: deployAccount} )                     
                    await instance.addPrefectureMember(prefectureMember, "prefectureMember1", {from: deployAccount} )
                    await instance.addBirth(citizenA.name, citizenA.lastName, citizenA.birthDate, citizenA.birthCity, {from: hospitalMember} )
                    await instance.verifyIdentity(0, {from: prefectureMember} )
                    const login = "login_" + citizenA.lastName + citizenA.birthDate
                    const pwd = "pwd_" + citizenA.birthDate                    
                    const tx = await instance.generateIdCertification(login, pwd, {from: citizen1} )
                    const txData = tx.logs[0].args
                    const certificationHash = txData.identity_hash

                    const tx2 = await instance.verifyCertification(certificationHash, {from: universityMember} )
                    const eventData = tx2.logs[0].args
                    assert.equal(eventData.name, citizenA.name, "the name should match")
                    assert.equal(eventData.lastName, citizenA.lastName, "the last name should match")
                    assert.equal(eventData.birthCity, citizenA.birthCity, "the birth city should match")
                })      
             
        })  


    })
})
