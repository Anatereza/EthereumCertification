# Avoiding Common Attacks <!-- omit in TOC -->

# Re-entracy Attacks (SWC-107)

I ensured the protection of my contracts from “Re-entrancy attacks” (SWC-107) by not doing any external calls, avoiding passing control flow to external contracts.

# Denial of Service by Block Gas Limit or startGas (SWC-128) 

In order to protect my contracts from “Denial of Service by Block Gas Limit or startGas” (SWC-128) I avoided the looping of contract over arrays of undetermined size. I chose the use of “mapping” instead of “array” to avoid looping throughout contract functionalities. 

# Integer Overflow and Underflow (SWC-101)
In order to protect my contracts from “Interger Overflow and Underflow” (SWC-101) I chose to use the “SafeMath” library (from OpenZeppelin - [SafeMath](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol)) to do all the arithmetic operations needed throughout my contract execution. The “SafeMath” library was implemented to eliminate an entire class of bugs linked to overflow.

# Force Sending Ether
In other to protect my contracts from the danger of “force sending Ether” and therefore depending on the contract balance, I chose to use the “selfdestruct” function. I used to “selfdestruct” function on the owner’s address and used it as the recipient forcing my contract’s (the destroyed contract) funds to be sent to the target.

