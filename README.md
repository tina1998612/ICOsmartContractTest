# Overview
Status ICO smart contract unit testing with the truffle framework

## Usage 
1. open a separate terminal window and run `testrpc`
2. run `truffle test` under this directory to compile contracts and execute the predefined test script
3. To interact with your ethereum node, opened by testrpc, use the command `geth attach http://localhost:8545` on a separate terminal window (The default node running port is 8545)

## For developers
1. To deploy a new contract, first find the name of the contract that can be deployed under `build/contracts` 
2. Edit `migrations/2_deploy_contracts.js` where you can specify what contract you want to deploy. <br>
For example, if the contract name is `Owned`:<br>
Create a contract object by adding this line `var Owned = artifacts.require("Owned")` to this file, and add `deployer.deploy(Owned)` inside `module.exports` function 
3. In the `test.js script` located under the `test` folder, ceate the contract object again by adding `var Owned = artifacts.require("Owned")` on the top lines 
4. Truffle allows you to test contracts one by one given default accounts/wallet address (In this case, it's the 10 accounts created by testrpc). The accounts created here are with special settings, so you can use them directly without caring when to unlock the account. <br>
Syntax:<br>
```javascript
contract('contract_name', function (accounts) {
    // your code here
}
```
5. Truffle uses the [Mocha](https://mochajs.org) testing framework, so the syntax are much alike<br>
For example:<br>
```javascript
contract('contract_name', function (accounts) {
    it('the_name_of_the_first_unit_test', function(){
        // your code here
        assert.equal(123, 123, "This message will not show if the first two values are equaled!");
    });
    it('the_name_of_the_second_unit_test', function(){
        // your code here
    });
}
```

