# Civil State dApp <!-- omit in TOC -->

# Table of Contents <!-- omit in TOC -->

- [Description](#description)
  - [User storiers](#user-stories)
- [Set up](#set-up)
  - [Prerequisite](#prerequisite)
  - [Installations](#installations)
  - [Compiling and migrating contracts](#compiling-and-migrating-contracts)
  - [Starting the web app](#starting-the-web-app)


# Description 

A platform to manage citizen’s civil state that operates on the blockchain. 

The application implemented in this project aims to be a platform to manage the citizen’s civil state. In this platform, hospital, prefecture, and city hall member interact with citizens and different entities to create citizen’s identity and generate certifications. 

## User stories

### Admin profile 
The administrator (the contract owner) opens the web app. The web app reads the address and identifies that the user is an admin, showing them admin only functions, such as adding new hospital, prefecture or city hall members. 
The admin has a new hospital member to add. The admin clicks in the “Add new hospital member” button and its redirected to the page. In the “Add new hospital member” page, the admin types the address and the name of the new member. The new hospital member can now connect to the web app and be recognized as a member.
The admin has a new prefecture member to add. The admin clicks in the “Add new prefecture member” button and its redirected to the page. In the “Add new prefecture member” page, the admin types the address and the name of the new member. The new prefecture member can now connect to the web app and be recognized as a member.
The admin has a new city hall member to add. The admin clicks in the “Add new city hall member” button and its redirected to the page. In the “Add new city hall member” page, the admin types the address and the name of the new member. The new city hall member can now connect to the web app and be recognized as a member.

### Hospital member
A hospital member (already registered by the admin) opens the web app. The web app reads the address and identifies that the user is a hospital member, showing them hospital member functions, such as adding new birth.
The hospital member has a new birth registration to add. The member types the birth information (name, last name, birth date and birth city). After validation of the birth, the member can check the birth id with the birth name and last name by clicking in the “Show birth id” button. 
The hospital member can navigate to the “Check births” page to check the list of births added, with a distinction between the “verified” and “to be verified”. 
When a birth is added its initial status is “to be verified”.  A prefecture member can verify a birth (after confirmation of the birth info) changing its status to “verified”.

### Prefecture member
A prefecture member (already registered by the admin) opens the web app. The web app reads the address and identifies that the user is a prefecture member, showing them prefecture member functions, such as verifying an identity.
The prefecture member navigates to the “Verify identity” page to check if there are new birth declared to verify. The member verifies a new identity by clicking in the “Verify identity” button below the birth information. After validation of the identity, the member can check the identity added with the birth name and last name by clicking in the “Show added identity” button.
The prefecture member can navigate to the “Check births” page to check the list of births added, with a distinction between the verified and to verified. 
The prefecture member can navigate to the “Check identities” page to check the list all verified identities. 
When a citizen identity is verified, a “login” and “password” are generated for the citizen (user). With its “login” and “password” a citizen can generate certifications that prove his identity. 
The default “login” generated is composed of the user last name and birth date (example “login_Smith01011990”). 
The default “password” generated is composed of the user birth date (example “pwd_01011990”). 

### Citizen
A citizen opens the web app. The web app reads the address and identifies that the user is not a hospital, prefecture or city hall member or the admin, showing them the citizen portal with citizen’s functions, such as generating an identity certification.

When the citizen connects to the web app for the first time, it is important to update their password. The citizen can change its password by navigating to the “Update password” page. 

A citizen needs a proof of his identity in order to register to the university. The citizen navigates to the “Generate certification” page, by entering his “login” and “password” he can generate a new identity certification. By clicking in the “Show certification” button he can retrieve the “hash” of the certification.

The citizen can provide the hash of the certification that proves his identity to any entity needing this proof. 

### University user (or any user or entity needing to verify a certification given by a citizen)

A university staff user (or any user or entity needing to verify a certification given by a citizen) opens the web app. The web app reads the address and identifies that the user is not a hospital, prefecture or city hall member or the admin, showing them the citizen portal with citizen’s functions, such as generating a verifying a certification. 
The university staff user wants to verify a certification by the hash given by a citizen. The staff user navigates to the “Verify certification” page. By entering the certification hash and clicking in the “Verify certification” button, if the certification verifies the citizen’s name, last name, birth date and birth city are displayed. 

### City Hall profile
A city hall (already registered by the admin) opens the web app. The web app reads the address and identifies that the user is a city hall member, showing them city hall member functions, such as declare a marriage.
The city hall member has a new marriage to declare. The member navigates to the “Declare marriage” page to register the new marriage. The member types the marriage date and clicks in the “Declare marriage” button below the citizen that has gotten married. 
To verify the marriage status of the citizen’s, the city hall member can navigate to the “Check identities”. In this page we can see the citizen’s identities information, with their marital status (single/married).

# Set up

## Prerequisite
- [Node](https://nodejs.org/en/download/) v12.17.0 or higher
- [Npm](https://www.npmjs.com/get-npm) v6.14.4 or higher

## Installations

### Truffle 
```bash
npm install -g truffle
```

### Ganache-cli
```bash
npm install -g ganache-cli
```

### Metamask 
Download Metamask from the [website](metamask.io)

## Compiling and migrating contracts
```bash
truffle compile
truffle migrate
```

## Starting the web app
- Navigate to the "client" folder : 
```bash
cd client
``` 

- Installing dependencies :
```bash
npm install
``` 

- Starting the app
```bash
npm start
```
> The application will start in your navigator : http://localhost:3000/

Explore the application ! 
