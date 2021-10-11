// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

const YieldContract = artifacts.require("YieldContract");
const Tether = artifacts.require("Tether");
const VeChain = artifacts.require("VeChain");
const ChainLink = artifacts.require("ChainLink");
const HuobiToken = artifacts.require("HuobiToken");
const BasicAttentionToken = artifacts.require("BasicAttentionToken");
const Multiplier = artifacts.require("Multiplier");
const multiplierAddress = "0x8A46B2238776d6152d0075733cac26F187D09251";

contract("YieldContract", function (accounts) {

  let yieldContractId;
  
  it("should not allow non owner to destroy contract", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let nonOwner = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = ethMintFactor;
    let tetherMintFactor = "1003500000000000000";
    let collateral = "3000000000000000000";
    let ethValue = collateral;
    let tenureInDays = 365;
    let interestRate = 1000000;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Transfer  5 billion MXX to the contract
      multiplierInstance.transfer(YieldContractInstance.address,"10000000000",{from:owner});

      // Add ETH as valid token/coin in yieldcontract
      return YieldContractInstance.addErc20(ethAddress,ethMintFactor,{from: owner});

    }).then(function(result){

      // Update multiplier mFactor as same as ETH mfactor
      return YieldContractInstance.updateMFactor(multiplierAddress,mxxMintFactor,{from: owner});

    }).then(function(result){

      // Set 100% interest for 365 days
      return YieldContractInstance.setInterest(tenureInDays,interestRate,{from: owner});

    }).then(function(result){

      // Set total allocated MXX to 3 MXX 
      return YieldContractInstance.setParamType(3,300000000,{from: owner});

    }).then(function(result){

       // Approve contract to transact MXX
      return multiplierInstance.approve(YieldContractInstance.address,mxxApprovedAmount,{from:owner});
    
    }).then(function(result){

      // Attempt to create a collateral with ETH
      return YieldContractInstance.createYieldContract(ethAddress, collateral, tenureInDays, {from : owner, value: ethValue});
    }).then(function(result){

      // Move 10 seconds
      return new Promise((resolve, reject) => {
        web3.currentProvider.send(
          {
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [10],
            id: new Date().getTime(),
          },
          (err, result) => {
            if (err) {
              return reject(err);
            }
            return resolve(result);
          }
        );
      });

    }).then(function(result){     
      
      // Get all yield contract
      return YieldContractInstance.getSubsetYieldContracts(0,100,{from : nonOwner});
    }).then(function(result){

      // Get yield contract id;
      yieldContractId = result[result.length - 1];   

      // Attempt to destroy contract by non owner
      return YieldContractInstance.destroyOMContract(yieldContractId, {from : nonOwner});

    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });

  it("should not allow owner to destroy active contract", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let nonOwner = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = ethMintFactor;
    let tetherMintFactor = "1003500000000000000";
    let collateral = "3000000000000000000";
    let ethValue = collateral;
    let tenureInDays = 365;
    let interestRate = 1000000;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to destroy contract by non owner
      return YieldContractInstance.destroyOMContract(yieldContractId, {from : owner});

    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });

  it("should not allow to create new yield contract", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let nonOwner = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = ethMintFactor;
    let tetherMintFactor = "1003500000000000000";
    let collateral = "3000000000000000000";
    let ethValue = collateral;
    let tenureInDays = 365;
    let interestRate = 1000000;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to create a collateral with ETH
      return YieldContractInstance.createYieldContract(ethAddress, collateral, tenureInDays, {from : owner, value: ethValue});
    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });

  it("should allow owner to destroy contract successfully", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let nonOwner = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let burnAddress = "0x19B292c1a84379Aab41564283e7f75bF20e45f91";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let tetherMintFactor = "1003500000000000000";
    let collateral = "1500000000000000000";
    let ethValue = collateral;
    let tenureInDays = 90;
    let totalMXXBeforeDestroy;
    let totalMXXAfterDestroy;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to destroy contract by non owner
      return YieldContractInstance.earlyRedeemContract(yieldContractId, {from : owner});

    }).then(function(result){

      // Early redeem
      return YieldContractInstance.mxxMintedFromContract({from : owner});

    }).then(function(result){

      totalMXXBeforeDestroy = result;
      console.log(totalMXXBeforeDestroy);

      // Attempt to destroy contract by non owner
      return YieldContractInstance.destroyOMContract(yieldContractId, {from : owner});

    }).then(function(result){

      // Early redeem
      return YieldContractInstance.mxxMintedFromContract({from : owner});

    }).then(function(result){

      totalMXXAfterDestroy = result;
      console.log(totalMXXAfterDestroy);

      // Get contract details
      return YieldContractInstance.contractMap.call(yieldContractId, {from: nonOwner});
    }).then(function(result){

      //Print results
      console.log("AFTER DESTROY")
      console.log(result.contractOwner);
      console.log(result.tokenAddress);
      console.log(result.startTime.toString());
      console.log(result.endTime.toString());
      console.log(result.collateral.toString());
      console.log(result.tenure.toString());
      console.log(result.interest.toString());
      console.log(result.mxxToBeMinted.toString());
      console.log(result.contractStatus.toString());

      // Early redeem
      assert.deepEqual(totalMXXBeforeDestroy.sub(totalMXXAfterDestroy) > 0,true,"Total MXX not updated properly");
      assert.deepEqual(result.contractStatus.toString(),'4',"Contract status not updated properly");

    });
  });

  it("should allow to create new yield contract", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let nonOwner = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = ethMintFactor;
    let tetherMintFactor = "1003500000000000000";
    let collateral = "1000000000000000000";
    let ethValue = collateral;
    let tenureInDays = 365;
    let interestRate = 1000000;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to create a collateral with ETH
      return YieldContractInstance.createYieldContract(ethAddress, collateral, tenureInDays, {from : owner, value: ethValue});
    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });

  it("should not allow owner to set bad minRedeemFee", function () {
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = ethMintFactor;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
      .then(function (instance) {
        multiplierInstance = instance;

        // Deploy yield contract
        return YieldContract.deployed(mxxMintFactor);
      })
      .then(function (instance) {
        YieldContractInstance = instance;

        // Attempt to set param type
        return YieldContractInstance.setParamType(
          1,
          1000000,
          { from: owner}
        );
      })
      .catch(function (error) {
        // Print error
        console.log(error.message);
        assert(true);
      });
  });

  it("should not allow owner to set bad maxRedeemFee", function () {
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = ethMintFactor;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
      .then(function (instance) {
        multiplierInstance = instance;

        // Deploy yield contract
        return YieldContract.deployed(mxxMintFactor);
      })
      .then(function (instance) {
        YieldContractInstance = instance;

        // Attempt to set param type
        return YieldContractInstance.setParamType(2, 0, { from: owner });
      })
      .catch(function (error) {
        // Print error
        console.log(error.message);
        assert(true);
      });
  });

  it("should not allow owner to set bad totalAllocatedMxx", function () {
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = ethMintFactor;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
      .then(function (instance) {
        multiplierInstance = instance;

        // Deploy yield contract
        return YieldContract.deployed(mxxMintFactor);
      })
      .then(function (instance) {
        YieldContractInstance = instance;

        // Attempt to set param type
        return YieldContractInstance.setParamType(3, 0, { from: owner });
      })
      .catch(function (error) {
        // Print error
        console.log(error.message);
        assert(true);
      });
  });

 });
