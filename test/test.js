var Owned = artifacts.require("Owned");
var SNT = artifacts.require("SNT");
var StatusContribution = artifacts.require("StatusContribution");
var DynamicCeiling = artifacts.require("DynamicCeiling");
var SGTExchanger = artifacts.require("SGTExchanger");
var MiniMeToken = artifacts.require("MiniMeToken");
var MiniMeTokenFactory = artifacts.require("MiniMeTokenFactory");

var Web3 = require('web3');
var web3 = new Web3(
  new Web3.providers.HttpProvider('http://localhost:8545')
);

/*
contract('Owned', function (accounts) {
  it("test", function () {
    var meta;

    return Owned.deployed().then(function (instance) {
      meta = instance;
      return meta.owner();
    }).then(function (owner) {
      assert.equal(accounts[0], owner, "owner is not the first account");

    });
  });
});
*/


/*
contract('SNT', function (accounts) {

  it("generate 1000 token in the owner account", function () {
    var meta;
    var generateTokenAmount = 10000;

    return SNT.deployed().then(function (instance) {
      meta = instance;
      return meta.generateTokens(accounts[0], generateTokenAmount);
    }).then(function (receipt) {
      return meta.balanceOf(accounts[0]);
    }).then(function (balanceOfOwner) {
      assert.equal(balanceOfOwner.toNumber(), generateTokenAmount, "generate token failed");
    });
  });

  it("approve allowance from account one to account two", function () {
    var meta;
    var amountToBeApproved = 100;

    return SNT.deployed().then(function (instance) {
      meta = instance;
      return meta.approve(accounts[1], amountToBeApproved);
    }).then(function (receipt) {
      //console.log(receipt);
      return meta.allowance(accounts[0], accounts[1]);
    }).then(function (allowance) {
      assert.equal(allowance.toNumber(), amountToBeApproved, "approve allowance failed");
    });
  });

  it("transfer extreme amount of money", function () {
    var meta;
    var amountToBeTransferred = 1;
    var acc1_balance;
    var acc2_balance;
    var new_acc1_balance;
    var new_acc2_balance;

    return SNT.deployed().then(function (instance) {
      meta = instance;
      return meta.balanceOf(accounts[0]);
    }).then(function (balance) {
      //console.log(balance.toNumber());
      acc1_balance = balance;
      return meta.balanceOf(accounts[1]);
    }).then(function (balance) {
      acc2_balance = balance;
      //console.log(balance.toNumber());
      return meta.transfer(accounts[1], amountToBeTransferred);
    }).then(function (receipt) {
      //console.log(receipt.receipt.logs);
      return meta.balanceOf(accounts[0]);
    }).then(function (balance) {
      new_acc1_balance = balance;
      //console.log(balance.toNumber());
      return meta.balanceOf(accounts[1]);
    }).then(function (balance) {
      //console.log(balance.toNumber());
      new_acc2_balance = balance;
      assert.equal(acc1_balance - amountToBeTransferred, new_acc1_balance, "money failed to transfer out");
      assert.equal(new_acc2_balance - amountToBeTransferred, acc2_balance, "money failed to transfer in");
    });
  });

  it("claim token", function () {
    var meta;

    return SNT.deployed().then(function (instance) {
      meta = instance;
      console.log(meta.address)
      //return meta.claimTokens(meta.address);
      return meta.controller.call();
    }).then(function (receipt) {
      console.log(receipt);
    });
  });
});
*/

contract('StatusContribution', function (accounts) {
  var meta;
  var MiniMeTokenFactory_address;
  var SGT_address;
  var SNT_address;
  var DynamicCeiling_address;
  var Status_instance;
  var acc1_balance;
  var acc2_balance;
  var acc1_balance_after;
  var acc2_balance_after;

  it("test", function () {
    MiniMeTokenFactory.deployed().then(function (instance) {
      MiniMeTokenFactory_address = instance.address;

      return MiniMeToken.new(MiniMeTokenFactory_address, 0, 0, "Status Genesis Token", 18, "SGT", true).then(function (instance) {
        SGT_address = instance.address;
        return SNT.new(MiniMeTokenFactory_address).then(function (SNT_instance) {
          SNT_address = SNT_instance.address;
          return DynamicCeiling.new(accounts[0], accounts[0]).then(function (instance) {
            DynamicCeiling_address = instance.address;
            return StatusContribution.deployed().then(function (instance) {
              Status_instance = instance;
              return SNT_instance.changeController(Status_instance.address);
            }).then(function () {
              //console.log(SNT_address, DynamicCeiling_address);
              //                                                                                                endBlock                                           where the contribution ether is sent
              return Status_instance.initialize(SNT_address, Status_instance.address, web3.eth.blockNumber + 3, web3.eth.blockNumber + 20, DynamicCeiling_address, accounts[2], accounts[1], accounts[1], accounts[1], SGT_address, 100000);
              //                                                     startBlock (+3 because the setGuaranteedAddress function requires blockNumber < stratBlock)                                                           
            }).then(function () {
              return web3.eth.getBalance(accounts[1]);
            }).then(function (balance) {
              acc1_balance = balance.toNumber();
              return web3.eth.getBalance(accounts[2]);
            }).then(function (balance) {
              acc2_balance = balance.toNumber();
              return Status_instance.startBlock.call();
            }).then(function (data) {
              console.log(data);
              return Status_instance.endBlock.call();
            }).then(function (data) {
              console.log(data);
              return Status_instance.setGuaranteedAddress(accounts[1], 1001);
              /*
            }).then(function (receipt) {
              console.log(receipt.logs[0].args);
              return web3.eth.sendTransaction({ from: accounts[0], to: accounts[1], value: 1000 });
            }).then(function () {
              return web3.eth.sendTransaction({ from: accounts[0], to: accounts[1], value: 1000 });
              */
            }).then(function () {
              console.log(web3.eth.blockNumber);
              return Status_instance.proxyPayment(accounts[1], { value: 1000 }); // apart from the token reciever's address, remember to specify the amount of money you want to pay for!
            }).then(function (receipt) {
              console.log(receipt.logs[0].args);
              //console.log(Status_instance);
              return Status_instance.guaranteedBuyersBought.call(accounts[1]); // call public variables with arguments, for ex. mapping
            }).then(function (balance) {
              acc1_balance_after = balance;
              console.log(balance);
              return Status_instance.totalGuaranteedCollected.call();
            }).then(function (data) {
              console.log(data);
            })
          });
        });
      });
    });
  });
});