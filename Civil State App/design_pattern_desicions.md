# Design Pattern Decisions <!-- omit in TOC -->

# Design patterns used in the project <!-- omit in TOC -->

- [Circuit Breaker](#circuit-breaker)
- [Mortal](#mortal)
- [Fail early and fail loud](#fail-early-and-fail-loud)
- [Restricting access](#restricting-access)



# Circuit Breaker

I chose the “Circuit Breaker” pattern to allow contract functionality to be stopped in situations such as a bug detection or a hack of the contract. 
In my circuit breaker pattern, I declared a “stopped” state variable that can only be modified by the admin (the owner of the contract). If needed the admin can change the “stopped” state variable to true, stopping the mainly contract functions and allowing the “withdraw” function to be call. The “withdraw” function transfers all the contract fund to the owner address. 


# Mortal

I chose the “Mortal” pattern to have the ability to destroy the contract and remove it from the blockchain (in case of emergency). This pattern is implemented through the “kill” function. Only the admin (the owner) can call the “kill” function. 

# Fail early and fail loud

I chose the “Fail early and fail loud” pattern to check for the conditions required for execution of certain functions as early as possible, making it immediately clear if the function executed properly or not. This pattern is implemented using “require” throughout the contract functions. The use of “require” at the beginning of the functions, throws immediately an exception if the condition is not met.

# Restricting access

I chose the “Restricting access” to restrict the access of some of the contract functions to specific addresses. This pattern is implemented with “modifiers”. The “modifiers” are implemented in a manner which allows only designated users to access administrative methods (such as adding a birth or verifying an identity). 
This pattern allows for the logic needed in the contract where different users (profile of user hospital member, prefecture member, citizen..) are allowed to access different methods. 

