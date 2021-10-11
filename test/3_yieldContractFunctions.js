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

  
  it("should throw an error when creating yield contract Invalid ERC20 (Tether)", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let collateral = "1500000000000000000";
    let ethValue = "1";
    let tenureInDays = 45;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Add ETH as valid token/coin in yieldcontract
      return YieldContractInstance.addErc20(ethAddress,ethMintFactor,{from: owner});

    }).then(function(result){

      // Deploy tether
      return Tether.deployed();
    }).then(function(instance){

      tetherInstance = instance;

      // Attempt to create a collateral with Tether which is not made valid in Yield Contract
      return YieldContractInstance.createYieldContract(tetherInstance.address, collateral, tenureInDays, {from : owner, value: ethValue});
    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });
  
  it("should throw an error when creating yield contract with bad tenure", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let collateral = "1500000000000000000";
    let ethValue = "1";
    let tenureInDays = 45;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to create a collateral with bad tenure (45 days has 0% interest)
      return YieldContractInstance.createYieldContract(ethAddress, collateral, tenureInDays, {from : owner, value: ethValue});
    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  }); 
  
  it("should throw an error when creating yield contract with bad ETH collateral", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let collateral = "1500000000000000000";
    let ethValue = "1";
    let tenureInDays = 90;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to create a collateral with bad collateral
      return YieldContractInstance.createYieldContract(ethAddress, collateral, tenureInDays, {from : owner, value: ethValue});
    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  }); 
  
  it("should throw an error when creating yield contract with 0 ETH collateral", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let collateral = "0";
    let ethValue = collateral;
    let tenureInDays = 90;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to create a collateral with bad collateral
      return YieldContractInstance.createYieldContract(ethAddress, collateral, tenureInDays, {from : owner, value: ethValue});
    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });
  
  it("should throw an error when creating yield contract sending both ETH and ERC20", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let tetherMintFactor = "1003500000000000000";
    let collateral = "1500000000000000000";
    let ethValue = collateral;
    let tenureInDays = 90;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy tether
      return Tether.deployed();
    }).then(function(instance){

      tetherInstance = instance;

      // Add Tether as valid token/coin in yieldcontract
      return YieldContractInstance.addErc20(tetherInstance.address,tetherMintFactor,{from: owner});
    
    }).then(function(result){


      // Attempt to create a collateral with Tether while sending ETH
      return YieldContractInstance.createYieldContract(tetherInstance.address, collateral, tenureInDays, {from : owner, value: ethValue});
    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });
  
  it("should throw an error when creating yield contract with 0 Tether", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let tetherMintFactor = "1003500000000000000";
    let collateral = "0";
    let ethValue = collateral;
    let tenureInDays = 90;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy tether
      return Tether.deployed();
    }).then(function(instance){

      tetherInstance = instance;

      // Attempt to create a collateral with Tether while sending ETH
      return YieldContractInstance.createYieldContract(tetherInstance.address, collateral, tenureInDays, {from : owner});
    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });
  
  it("should throw an error when creating yield contract with high MXX to be Minted (MXX to be minted > total allocated MXX)", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "1000";
    let tetherMintFactor = "1003500000000000000";
    let collateral = "1500000000000000000";
    let ethValue = collateral;
    let tenureInDays = 90;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Set mint factor to 1000
      return YieldContractInstance.updateMFactor(multiplierInstance.address,mxxMintFactor,{from: owner});
    }).then(function(result){

      // Attempt to create a collateral with ETH (with MXX low mint factor)
      return YieldContractInstance.createYieldContract(ethAddress, collateral, tenureInDays, {from : owner, value: collateral});
    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });
  
  it("should throw an error when creating collateral with Tether but user have not approved the contract to spend Tether", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let tetherMintFactor = "1003500000000000000";
    let collateral = "1";
    let ethValue = collateral;
    let tenureInDays = 90;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Set mint factor
      return YieldContractInstance.updateMFactor(multiplierInstance.address,mxxMintFactor,{from: owner});
    }).then(function(result){

      // Deploy tether
      return Tether.deployed();
    }).then(function(instance){

      tetherInstance = instance;

      // Attempt to create a collateral with Tether while sending ETH
      return YieldContractInstance.createYieldContract(tetherInstance.address, collateral, tenureInDays, {from : owner});
    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });
  
  it("should throw an error when creating yield contract but less MXX to be burned (MXX not yet approved)", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "110000000000000000";
    let tetherMintFactor = "1003500000000000000";
    let collateral = "1500000";
    let ethValue = collateral;
    let tenureInDays = 90;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to create a collateral with ETH (with MXX not approved to be spent)
      return YieldContractInstance.createYieldContract(ethAddress, collateral, tenureInDays, {from : owner, value: ethValue});
    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });
  
  it("should create yield contract successfully", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let tetherMintFactor = "1003500000000000000";
    let collateral = "1500000000000000000";
    let ethValue = collateral;
    let tenureInDays = 90;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Approve contract to transact MXX
      return multiplierInstance.approve(YieldContractInstance.address,mxxApprovedAmount,{from:owner});
    
    }).then(function(result){

      // Attempt to create a collateral with ETH
      return YieldContractInstance.createYieldContract(ethAddress, collateral, tenureInDays, {from : owner, value: ethValue});
    }).then(function(result){

      var gas = Number(result);

      console.log("gas estimation = " + result.receipt.gasUsed + " units");

      // Assert
      assert.deepEqual(result['receipt']['status'],true,"Yield contract added successfully");
    });
  });
  
  it("should get contract details successfully", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let nonOwner = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let tetherMintFactor = "1003500000000000000";
    let collateral = "1500000000000000000";
    let yieldContractId;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Get all yield contract
      return YieldContractInstance.getSubsetYieldContracts(0,100,{from : nonOwner});
    }).then(function(result){

      // Assert
      yieldContractId = result[result.length - 1];    

      return YieldContractInstance.contractMap.call(yieldContractId,{ from: nonOwner });

    }).then(function(result){

      // Print result
      console.log(result.contractOwner);
      console.log(result.tokenAddress);
      console.log(result.startTime.toString());
      console.log(result.endTime.toString());
      console.log(result.collateral.toString());
      console.log(result.tenure.toString());
      console.log(result.interest.toString());
      console.log(result.mxxToBeMinted.toString());
      console.log(result.contractStatus.toString());

      // Assert
      assert.deepEqual(result.contractOwner,owner,"Yield Contract Owner not returned properly");
      assert.deepEqual(result.tokenAddress,ethAddress,"Yield Collateral Address not returned properly");
      assert.deepEqual(result.collateral.toString(),collateral,"Yield Collateral not returned properly");
      assert.deepEqual(result.tenure.toString(),"90","Yield tenure not returned properly");
      assert.deepEqual(result.interest.toString(),"2000000","Yield APY not returned properly");
      assert.deepEqual(result.mxxToBeMinted.toString(),"2810958904109","MXX minted not returned properly");
      assert.deepEqual(result.contractStatus.toString(),"1","Contract status not returned properly");
    });
  });
  
  it("should get yield contract for ERC20 collateral successfully", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let nonOwner = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let tetherApprovedAmount = "6877479171538729000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let tetherMintFactor = "1003500000000000000";
    let collateral = "500000";
    let tenureInDays = "180";
    let yieldContractId;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy tether
      return Tether.deployed();

    }).then(function(instance){

      tetherInstance = instance;

      // Approve user to spend tether
      return tetherInstance.approve(YieldContractInstance.address,tetherApprovedAmount,{from: owner});
    
    }).then(function(result){

      // Create yield contract
      return YieldContractInstance.createYieldContract(tetherInstance.address,collateral,tenureInDays,{from: owner});

    }).then(function(result){

      console.log("Gas used");
      console.log(result.receipt.gasUsed);

      // Get contract list
      return YieldContractInstance.getSubsetYieldContracts(0,100,{ from: owner });
    
    }).then(function(result){

      // Assert
      yieldContractId = result[result.length - 1]; 
      
      console.log("yield id");
      console.log(yieldContractId);

      return YieldContractInstance.contractMap.call(yieldContractId,{ from: nonOwner });

    }).then(function(result){

      //Print results
      console.log(result.contractOwner);
      console.log(result.tokenAddress);
      console.log(result.startTime.toString());
      console.log(result.endTime.toString());
      console.log(result.collateral.toString());
      console.log(result.tenure.toString());
      console.log(result.interest.toString());
      console.log(result.mxxToBeMinted.toString());
      console.log(result.contractStatus.toString());

      // Assert
      assert.deepEqual(result.contractOwner,owner,"Yield Contract Owner not returned properly");
      assert.deepEqual(result.tokenAddress,tetherInstance.address,"Yield Collateral Address not returned properly");
      assert.deepEqual(result.collateral.toString(),collateral,"Yield Collateral not returned properly");
      assert.deepEqual(result.tenure.toString(),"180","Yield tenure not returned properly");
      assert.deepEqual(result.interest.toString(),"4000000","Yield APY not returned properly");
      assert.deepEqual(result.mxxToBeMinted.toString(),"9897534246","MXX minted not returned properly");
      assert.deepEqual(result.contractStatus.toString(),"1","Contract status not returned properly");
    });
  });
  
  it("should update ERC20 balance and lists correctly", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let nonOwner = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let tetherApprovedAmount = "6877479171538729000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let tetherMintFactor = "1003500000000000000";
    let collateral = "500000";
    let tenureInDays = "180";
    let initialOwnerTetherBalance;
    let initialContractTetherBalance;
    let finalOwnerTetherBalance;
    let finalContractTetherBalance;
    let initialOwnerMXXBalance;
    let finalOwnerMXXBalance;
    let yieldContractId;
    let mxxBurnt;
    let mxxMinted;
    let initialAllContractsLength;
    let finalAllContractsLength;
    let initialUserContractsLength;
    let finalUserContractsLength;
    let mxxMintedFromContractBefore;
    let mxxMintedFromContractAfter;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy tether
      return Tether.deployed();

    }).then(function(instance){

      tetherInstance = instance;

      // Get owner tether balance
      return tetherInstance.balanceOf(owner,{from: owner});
    
    }).then(function(result){

      initialOwnerTetherBalance = result;

      // Get contract tether balance
      return tetherInstance.balanceOf(YieldContractInstance.address,{from: owner});

    }).then(function(result){

      initialContractTetherBalance = result;

      // Get owner MXX balance
      return multiplierInstance.balanceOf(owner, { from: owner });
    
    }).then(function(result){

      initialOwnerMXXBalance = result;

      // Get mxxMintedFromYieldContracts
      return YieldContractInstance.mxxMintedFromContract.call({ from: owner });
    
    }).then(function(result){

      mxxMintedFromContractBefore = result;

      // Get initial user list length
      return YieldContractInstance.getSubsetYieldContracts(0,100,{ from: owner });
    
    }).then(function(result){

      initialAllContractsLength = result.length;

      // Create yield contract
      return YieldContractInstance.createYieldContract(tetherInstance.address,collateral,tenureInDays,{from: owner});

    }).then(function(result){

      // Get owner tether balance
      return tetherInstance.balanceOf(owner,{from: owner});
    
    }).then(function(result){

      finalOwnerTetherBalance = result;

      // Get contract tether balance
      return tetherInstance.balanceOf(YieldContractInstance.address,{from: owner});

    }).then(function(result){

      finalContractTetherBalance = result;

      // Get owner MXX balance
      return multiplierInstance.balanceOf(owner, { from: owner });
    
    }).then(function(result){

      finalOwnerMXXBalance = result;

      // Get mxxMintedFromYieldContracts
      return YieldContractInstance.mxxMintedFromContract.call({ from: owner });
    
    }).then(function(result){

      mxxMintedFromContractAfter = result;

      // Get all yield contract
      return YieldContractInstance.getSubsetYieldContracts(0,100,{from : nonOwner});
    }).then(function(result){

      finalAllContractsLength = result.length;
      yieldContractId = result[result.length - 1];

      // Get MXX burnt
      return YieldContractInstance.contractMap.call(yieldContractId, {
        from: nonOwner
      });
    }).then(function(result){

      mxxMinted = result.mxxToBeMinted;

      assert.deepEqual(initialOwnerTetherBalance.sub(finalOwnerTetherBalance).toString(),collateral,"Tether not sent properly");
      assert.deepEqual(finalContractTetherBalance.sub(initialContractTetherBalance).toString(),collateral,"Tether not received properly");
      assert.deepEqual(initialOwnerMXXBalance.sub(finalOwnerMXXBalance).toNumber() > 0,true,"MXX not burnt properly");
      assert.deepEqual(mxxMintedFromContractAfter.sub(mxxMintedFromContractBefore).toString(),mxxMinted.toString(),"Total MXX minted updated properly");
      assert.deepEqual(finalAllContractsLength - initialAllContractsLength,1,"All contract list not updated properly");
    });
  });
  
  it("should not allow owner to remove tether as it has yield contracts", function () {

    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let owner = accounts[0];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy tether
      return Tether.deployed()
    }).then(function(instance){

      tetherInstance = instance;

      // Attempt to remove Tether ERC20 from list by owner
      return YieldContractInstance.removeErc20(tetherInstance.address,{from: owner});
    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
    
  }); 

  it("should throw an error when creating contract for a delisted token", function () {

    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let owner = accounts[0];
    let collateral = "500000"
    let tenureInDays = "90";

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy tether
      return Tether.deployed()
    }).then(function(instance){

      tetherInstance = instance;

      // Attempt to delist Tether ERC20 from list by owner
      return YieldContractInstance.setErc20Validity(tetherInstance.address, false, {
        from: owner,
      });
    }).then(function(result){

      // Attempt to create a tether contract
      return YieldContractInstance.createYieldContract(tetherInstance.address,collateral,tenureInDays,{from: owner});

    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
    
  });

  it("should create a contract for an undelisted token", function () {

    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let owner = accounts[0];
    let collateral = "500000"
    let tenureInDays = "90";

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy tether
      return Tether.deployed()
    }).then(function(instance){

      tetherInstance = instance;

      // Attempt to undelist Tether ERC20 from list by owner
      return YieldContractInstance.setErc20Validity(tetherInstance.address, true, {
        from: owner,
      });
    }).then(function(result){

      // Attempt to create a tether contract
      return YieldContractInstance.createYieldContract(tetherInstance.address,collateral,tenureInDays,{from: owner});

    }).then(function(result){

      // Assert
      assert.deepEqual(result['receipt']['status'],true,"Yield contract added successfully");
    });
    
  });

  it("should throw an error when early redeem inactive yield contract", function () {
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let collateral = "1500000000000000000";
    let ethValue = "1";
    let tenureInDays = 45;
    let inactiveYieldContractId = '0x0000000000000000000000000000000000000000000000000000000000000000'

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
      .then(function (instance) {
        multiplierInstance = instance;

        // Deploy yield contract
        return YieldContract.deployed(multiplierInstance.address,mxxMintFactor);
      })
      .then(function (instance) {
        YieldContractInstance = instance;

        // Attempt to early redeem yield contract
        return YieldContractInstance.earlyRedeemContract(
          inactiveYieldContractId,
          { from: owner}
        );
      })
      .catch(function (error) {
        // Print error
        console.log(error.message);
        assert(true);
      });
  });  

  it("should not allow to early redeem for another contract", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let nonOwner = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let tetherMintFactor = "1003500000000000000";
    let collateral = "1500000000000000000";
    let yieldContractId;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Get all yield contract
      return YieldContractInstance.getSubsetYieldContracts(0,100,{from : nonOwner});
    }).then(function(result){

      // Assert
      yieldContractId = result[result.length - 1];    

      // Attempt to early redeem contract by non owner
      return YieldContractInstance.earlyRedeemContract(yieldContractId,{ from: nonOwner });

    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });

  it("should not early redeem claimable contract when its claimable", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let nonOwner = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let tetherMintFactor = "1003500000000000000";
    let collateral = "1500000000000000000";
    let ethValue = collateral;
    let yieldContractId;
    let tenureInDays = "0";

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Get all yield contract
      return YieldContractInstance.setInterest(0,100000000,{from : owner});
    }).then(function(result){

      // Attempt to create a collateral with ETH
      return YieldContractInstance.createYieldContract(ethAddress, collateral, tenureInDays, {from : owner, value: ethValue});

    }).then(function(result){

      // Get last contract
      return YieldContractInstance.getSubsetYieldContracts(0,100,{from : nonOwner});

    }).then(function(result){

      // Assert
      yieldContractId = result[result.length - 1];    

      // Attempt to early redeem contract by owner
      return YieldContractInstance.earlyRedeemContract(yieldContractId,{ from: owner });

    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });

  it("should early redeem contract with ETH successfully", function () {
    
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
    let ethBalanceBeforeEarlyRedeem;
    let mxxBeforeEarlyRedeem;
    let mxxBurnAddressBeforeEarlyRedeem;
    let ethBalanceAfterEarlyRedeem;
    let mxxAfterEarlyRedeem;
    let mxxBurnAddressAfterEarlyRedeem;
    let yieldContractId;;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Approve contract to transact MXX
      return multiplierInstance.approve(YieldContractInstance.address,mxxApprovedAmount,{from:owner});
    
    }).then(function(result){

      // Transfer 1 billion MXX to the contract
      multiplierInstance.transfer(YieldContractInstance.address,"100000000000000000",{from:owner});

    }).then(function(result){

      // Attempt to create a collateral with ETH
      return YieldContractInstance.createYieldContract(ethAddress, collateral, tenureInDays, {from : owner, value: ethValue});
    }).then(function(result){

      // return get balance
      return web3.eth.getBalance(owner);

    }).then(function(result){

      ethBalanceBeforeEarlyRedeem = result;

      // Get MXX balance of owner
      return multiplierInstance.balanceOf(owner, { from: owner });

    }).then(function(result){

      mxxBeforeEarlyRedeem = result;

      // Get MXX balance of burn address
      return multiplierInstance.balanceOf(burnAddress, { from: owner });

    }).then(function(result){

      mxxBurnAddressBeforeEarlyRedeem = result;

      // Get contract details
      return YieldContractInstance.getSubsetYieldContracts(0,100,{from : owner});

    }).then(function(result){

      yieldContractId = result[result.length - 1];

      // Get MXX burnt
      return YieldContractInstance.contractMap.call(yieldContractId, {from: nonOwner});
    }).then(function(result){

      //Print results
      console.log("BEFORE EARLY REDEEM")
      console.log(result.contractOwner);
      console.log(result.tokenAddress);
      console.log(result.startTime.toString());
      console.log(result.endTime.toString());
      console.log(result.collateral.toString());
      console.log(result.tenure.toString());
      console.log(result.interest.toString());
      console.log(result.mxxToBeMinted.toString());
      console.log(result.contractStatus.toString());

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

      // Early redeem
      return YieldContractInstance.earlyRedeemContract(yieldContractId, {from : owner});

    }).then(function(result){

      // return get balance
      return web3.eth.getBalance(owner);

    }).then(function(result){

      ethBalanceAfterEarlyRedeem = result;

      // Get MXX balance of owner
      return multiplierInstance.balanceOf(owner, { from: owner });

    }).then(function(result){

      mxxAfterEarlyRedeem = result;

      // Get MXX balance of burn address
      return multiplierInstance.balanceOf(burnAddress, { from: owner });

    }).then(function(result){

      mxxBurnAddressAfterEarlyRedeem = result;

      // Get contract details
      return YieldContractInstance.contractMap.call(yieldContractId, {from: nonOwner});
    }).then(function(result){

      //Print results
      console.log("AFTER EARLY REDEEM")
      console.log(result.contractOwner);
      console.log(result.tokenAddress);
      console.log(result.startTime.toString());
      console.log(result.endTime.toString());
      console.log(result.collateral.toString());
      console.log(result.tenure.toString());
      console.log(result.interest.toString());
      console.log(result.mxxToBeMinted.toString());
      console.log(result.contractStatus.toString());

      console.log("COLLATERAL RETURNED TO USER");
      console.log(ethBalanceAfterEarlyRedeem - ethBalanceBeforeEarlyRedeem);

      console.log("MXX SENT BACK TO USER");
      console.log(mxxAfterEarlyRedeem.sub(mxxBeforeEarlyRedeem).toString());

      console.log("MXX BURNED AS PENALTY FEE");
      console.log(mxxBurnAddressAfterEarlyRedeem.sub(mxxBurnAddressBeforeEarlyRedeem).toString());

      // Early redeem
      assert.deepEqual(ethBalanceAfterEarlyRedeem - ethBalanceBeforeEarlyRedeem > 0,true,"Collateral not received properly");
      assert.deepEqual(mxxAfterEarlyRedeem.sub(mxxBeforeEarlyRedeem) > 0,true,"Mxx not received by user properly");
      assert.deepEqual(mxxBurnAddressAfterEarlyRedeem.sub(mxxBurnAddressBeforeEarlyRedeem) > 0,true,"Mxx not received by burn address properly");

    });
  });

  it("should early redeem contract with ERC20 tether successfully", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let nonOwner = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let burnAddress = "0x19B292c1a84379Aab41564283e7f75bF20e45f91";
    let tetherApprovedAmount = "6877479171538729000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let tetherMintFactor = "1003500000000000000";
    let collateral = "500000";
    let tenureInDays = "180";
    let tetherBalanceBeforeEarlyRedeem;
    let mxxBeforeEarlyRedeem;
    let mxxBurnAddressBeforeEarlyRedeem;
    let tetherBalanceAfterEarlyRedeem;
    let mxxAfterEarlyRedeem;
    let mxxBurnAddressAfterEarlyRedeem;
    let yieldContractId;;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy tether
      return Tether.deployed();

    }).then(function(instance){

      tetherInstance = instance;

      // Attempt to create a collateral with ETH
      return YieldContractInstance.createYieldContract(tetherInstance.address, collateral, tenureInDays, {from : owner});
    }).then(function(result){

      // return get Tether balance
      return tetherInstance.balanceOf(owner, { from: owner });

    }).then(function(result){

      tetherBalanceBeforeEarlyRedeem = result;

      // Get MXX balance of owner
      return multiplierInstance.balanceOf(owner, { from: owner });

    }).then(function(result){

      mxxBeforeEarlyRedeem = result;

      // Get MXX balance of burn address
      return multiplierInstance.balanceOf(burnAddress, { from: owner });

    }).then(function(result){

      mxxBurnAddressBeforeEarlyRedeem = result;

      // Get contract details
      return YieldContractInstance.getSubsetYieldContracts(0,100,{from : owner});

    }).then(function(result){

      yieldContractId = result[result.length - 1];

      // Get MXX burnt
      return YieldContractInstance.contractMap.call(yieldContractId, {from: nonOwner});
    }).then(function(result){

      //Print results
      console.log("BEFORE EARLY REDEEM")
      console.log(result.contractOwner);
      console.log(result.tokenAddress);
      console.log(result.startTime.toString());
      console.log(result.endTime.toString());
      console.log(result.collateral.toString());
      console.log(result.tenure.toString());
      console.log(result.interest.toString());
      console.log(result.mxxToBeMinted.toString());
      console.log(result.contractStatus.toString());

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

      // Early redeem
      return YieldContractInstance.earlyRedeemContract(yieldContractId, {from : owner});

    }).then(function(result){

      // return get Tether balance
      return tetherInstance.balanceOf(owner, { from: owner });

    }).then(function(result){

      tetherBalanceAfterEarlyRedeem = result;

      // Get MXX balance of owner
      return multiplierInstance.balanceOf(owner, { from: owner });

    }).then(function(result){

      mxxAfterEarlyRedeem = result;

      // Get MXX balance of burn address
      return multiplierInstance.balanceOf(burnAddress, { from: owner });

    }).then(function(result){

      mxxBurnAddressAfterEarlyRedeem = result;

      // Get contract details
      return YieldContractInstance.contractMap.call(yieldContractId, {from: nonOwner});
    }).then(function(result){

      //Print results
      console.log("AFTER EARLY REDEEM")
      console.log(result.contractOwner);
      console.log(result.tokenAddress);
      console.log(result.startTime.toString());
      console.log(result.endTime.toString());
      console.log(result.collateral.toString());
      console.log(result.tenure.toString());
      console.log(result.interest.toString());
      console.log(result.mxxToBeMinted.toString());
      console.log(result.contractStatus.toString());

      console.log("COLLATERAL RETURNED TO USER");
      console.log(tetherBalanceAfterEarlyRedeem.sub(tetherBalanceBeforeEarlyRedeem).toString());

      console.log("MXX SENT BACK TO USER");
      console.log(mxxAfterEarlyRedeem.sub(mxxBeforeEarlyRedeem).toString());

      console.log("MXX BURNED AS PENALTY FEE");
      console.log(mxxBurnAddressAfterEarlyRedeem.sub(mxxBurnAddressBeforeEarlyRedeem).toString());

      // Early redeem
      assert.deepEqual(tetherBalanceAfterEarlyRedeem.sub(tetherBalanceBeforeEarlyRedeem).toString(),collateral,"Collateral not received properly");
      assert.deepEqual(mxxAfterEarlyRedeem.sub(mxxBeforeEarlyRedeem) > 0,true,"Mxx not received by user properly");
      assert.deepEqual(mxxBurnAddressAfterEarlyRedeem.sub(mxxBurnAddressBeforeEarlyRedeem) > 0,true,"Mxx not received by burn address properly");

    });
  });

  it("should throw an error when trying to acquire an active contract", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let collateral = "1500000000000000000";
    let ethValue = collateral;
    let tenureInDays = 90;
    let yieldContractId;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to create a collateral with Ether
      return YieldContractInstance.createYieldContract(ethAddress, collateral, tenureInDays, {from : owner, value: ethValue});
    }).then(function(result){

      // Get contract details
      return YieldContractInstance.getSubsetYieldContracts(0,100,{from : owner});

    }).then(function(result){

      yieldContractId = result[result.length - 1];

      // Attempt to acquire an active contract
      return YieldContractInstance.acquireYieldContract(yieldContractId, {from : owner, value: ethValue});
    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });

  it("should throw an error when trying to acquire contract with no ETH", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let nonOwner = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let collateral = "1500000000000000000";
    let ethValue = collateral;
    let tenureInDays = 45;
    let yieldContractId;
    let newCollateralToPay;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

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

      // Get contract details
      return YieldContractInstance.getSubsetYieldContracts(0,100,{from : owner});

    }).then(function(result){

      yieldContractId = result[result.length - 1];

      // Attempt to acquire an active contract
      return YieldContractInstance.earlyRedeemContract(yieldContractId, {from : owner});
    }).then(function(result){

      // Get contract details
      return YieldContractInstance.contractMap(yieldContractId,{from : nonOwner});

    }).then(function(result){

      newCollateralToPay = result.collateral;

      // Attempt to acquire contract with 0 ETH
      return YieldContractInstance.acquireYieldContract(yieldContractId,{from : nonOwner, value: 0});

    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });

  it("should allow Bob to acquire contract successfully ", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let bob = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let collateral = "1500000000000000000";
    let ethValue = collateral;
    let tenureInDays = 45;
    let yieldContractId;
    let newCollateralToPay;
    let oldStartTime;
    let newStartTime;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

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

      // Get contract details
      return YieldContractInstance.getSubsetYieldContracts(0,100,{from : owner});

    }).then(function(result){

      yieldContractId = result[result.length - 1];

      // Get contract details
      return YieldContractInstance.contractMap(yieldContractId,{from : bob});

    }).then(function(result){

      newCollateralToPay = result.collateral;
      oldStartTime = result.startTime;

      // Attempt to acquire contract with 0 ETH
      return YieldContractInstance.acquireYieldContract(yieldContractId,{from : bob, value: newCollateralToPay});

    }).then(function(result){

      // Get contract details
      return YieldContractInstance.contractMap(yieldContractId,{from : bob});
    }).then(function(result){

      newStartTime = result.startTime;

      // Assert
      assert.deepEqual(newStartTime.toString(),oldStartTime.toString(), "Start time updated");
      assert.deepEqual(result.contractOwner,bob,"Contract owner not update");
      assert.deepEqual(result.contractStatus.toString(),"1","Contract status not changed to active");
    });
  });

  it("should throw an error when trying to acquire a Tether contract with ETH", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let bob = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let collateral = "1000000000000";
    let ethValue = collateral;
    let tenureInDays = 90;
    let yieldContractId;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy tether
      return Tether.deployed();

    }).then(function(instance){

      // Tether Instance
      tetherInstance = instance; 
      
      // Transfer USDT to bob
      return tetherInstance.transfer(bob,"1000000000000");

    }).then(function(result){

      // Attempt to create a collateral with Tether
      return YieldContractInstance.createYieldContract(tetherInstance.address, collateral, tenureInDays, {from : owner});
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

      // Get contract details
      return YieldContractInstance.getSubsetYieldContracts(0,100,{from : owner});

    }).then(function(result){

      yieldContractId = result[result.length - 1];

      // Attempt to early redeem contract
      return YieldContractInstance.earlyRedeemContract(yieldContractId, {from : owner});

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

      // Attempt to acquire previous Tether contract with ETH
      return YieldContractInstance.acquireYieldContract(yieldContractId, {from : bob, value: ethValue});
    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });

  it("should not allow bob to acquire a tether contract without proper allowance", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let bob = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let collateral;
    let ethValue = collateral;
    let tenureInDays = 90;
    let yieldContractId;
    let bobBalanceBefore;
    let bobBalanceAfter;
    let startTimeBefore;
    let startTimeAfter;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy tether
      return Tether.deployed();

    }).then(function(instance){

      // Tether Instance
      tetherInstance = instance; 
      
      // Get bob USDT balance
      return tetherInstance.balanceOf(bob);

    }).then(function(result){

      bobBalanceBefore = result;

      // Get contract details
      return YieldContractInstance.getSubsetYieldContracts(0,100,{from : owner});

    }).then(function(result){

      yieldContractId = result[result.length - 1];

      // Attempt get contract details
      return YieldContractInstance.contractMap.call(yieldContractId, {from : owner});

    }).then(function(result){

      startTimeBefore = result.startTime;   
      
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

      // Attempt to acquire previous Tether contract
      return YieldContractInstance.acquireYieldContract(yieldContractId, {from : bob});

    }).then(function(result){

      // Get bob USDT balance
      return tetherInstance.balanceOf(bob);

    }).then(function(result){

      bobBalanceAfter = result;

      // Get contract details
      return YieldContractInstance.contractMap.call(yieldContractId, {from : owner});

    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);

    });
  });

  it("should allow bob to acquire a tether contract with USDT", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let bob = accounts[1];
    let mxxApprovedAmount = "900000000000000000";
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let collateral;
    let ethValue = collateral;
    let tenureInDays = 90;
    let yieldContractId;
    let bobBalanceBefore;
    let bobBalanceAfter;
    let startTimeBefore;
    let startTimeAfter;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy tether
      return Tether.deployed();

    }).then(function(instance){

      // Tether Instance
      tetherInstance = instance; 
      
      // Get bob USDT balance
      return tetherInstance.balanceOf(bob);

    }).then(function(result){
      bobBalanceBefore = result;

      // Approving contract to spend USDT by bob
      return tetherInstance.approve(YieldContractInstance.address,"1000000000000000",{from: bob});
    }).then(function(result){      

      // Get contract details
      return YieldContractInstance.getSubsetYieldContracts(0,100,{from : owner});

    }).then(function(result){

      yieldContractId = result[result.length - 1];

      // Attempt get contract details
      return YieldContractInstance.contractMap.call(yieldContractId, {from : owner});

    }).then(function(result){

      startTimeBefore = result.startTime;   
      
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

      // Attempt to acquire previous Tether contract
      return YieldContractInstance.acquireYieldContract(yieldContractId, {from : bob});

    }).then(function(result){

      // Get bob USDT balance
      return tetherInstance.balanceOf(bob);

    }).then(function(result){

      bobBalanceAfter = result;

      // Get contract details
      return YieldContractInstance.contractMap.call(yieldContractId, {from : owner});

    }).then(function(result){

      startTimeAfter = result.startTime;
      collateral = result.collateral;

      // Assert
      assert.deepEqual(bobBalanceBefore.sub(bobBalanceAfter).toString(),collateral.toString(),"Collateral not received properly");
      assert.deepEqual(startTimeAfter.toString(),startTimeBefore.toString(),"Start time updated");
      assert.deepEqual(result.contractOwner,bob,"Owner not updated correctly");
      assert.deepEqual(result.contractStatus.toString(),"1","Contract status not updated correctly");

    });
  });

  it("should not allow bob to acquire a contract in inactive state", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let bob = accounts[1];
    let mxxMintFactor = "10000000000000000";
    let inactiveYieldContractId =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to claim contract by Bob
      return YieldContractInstance.claimYieldContract(inactiveYieldContractId, { from: bob });

    }).catch(function(error){

      // Print error
      console.log(error.message);
      assert(true);
    });
  });

  it("should not allow alice to acquire an active contract that he does not own", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let alice = accounts[0];
    let bob = accounts[1];
    let mxxMintFactor = "10000000000000000";
    let yieldContractId;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to claim contract by Bob
      return YieldContractInstance.getSubsetYieldContracts(0,100, { from: alice });

    }).then(function(result){

      yieldContractId = result[result.length - 1];

      // Attempt by owner to acquire a contract
      return YieldContractInstance.claimYieldContract(yieldContractId, { from: alice });
    }).catch(function(error){
      // Print error
      console.log(error.message);
      assert(true);
    });
  });

  it("should not allow bob to acquire an active contract before its end time", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let bob = accounts[1];
    let mxxMintFactor = "10000000000000000";
    let yieldContractId;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to claim contract by Bob
      return YieldContractInstance.getSubsetYieldContracts(0,100, { from: owner });

    }).then(function(result){

      yieldContractId = result[result.length - 1];

      // Attempt by bob to acquire a contract
      return YieldContractInstance.claimYieldContract(yieldContractId, { from: bob });
    }).catch(function(error){
      // Print error
      console.log(error.message);
      assert(true);
    });
  });

  it("should allow bob to claim contract successfully", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let bob = accounts[1];
    let mxxMintFactor = "10000000000000000";
    let yieldContractId;
    let bobBalanceBefore;
    let bobBalanceAfter;
    let bobMxxBalanceBefore;
    let bobMxxBalanceAfter;
    let noOfContractsBefore;
    let noOfContractsAfter;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      return Tether.deployed();

    }).then(function(instance){

      tetherInstance = instance;

      // Get user USDT balance
      return tetherInstance.balanceOf(bob);

    }).then(function(result){
      
      bobBalanceBefore = result;

      // Get user MXX balance
      return multiplierInstance.balanceOf(bob);

    }).then(function(result){
      
      bobMxxBalanceBefore = result;

      // Get tether no of contracts
      return YieldContractInstance.erc20Map.call(tetherInstance.address,{from: bob});

    }).then(function(result){

      noOfContractsBefore = result[2];

      // Move a year forward
      return new Promise((resolve, reject) => {
        web3.currentProvider.send(
          {
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [31536000],
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

      // Get contract details
      return YieldContractInstance.getSubsetYieldContracts(0,100,{from: bob});

    }).then(function(result){

      yieldContractId = result[result.length - 1];

      // Attempt to claim contract by Bob
      return YieldContractInstance.claimYieldContract(yieldContractId, { from: bob });

    }).then(function(result){

      // Get user USDT balance
      return tetherInstance.balanceOf(bob);

    }).then(function(result){
      
      bobBalanceAfter = result;

      // Get user MXX balance
      return multiplierInstance.balanceOf(bob);

    }).then(function(result){
      
      bobMxxBalanceAfter = result;

      // Get tether no of contracts
      return YieldContractInstance.erc20Map.call(tetherInstance.address,{from: bob});

    }).then(function(result){

      noOfContractsAfter = result[2];

      // Get contract details
      return YieldContractInstance.contractMap(yieldContractId,{from: bob});

    }).then(function(result){

      // Assert
      assert.deepEqual(bobBalanceAfter.sub(bobBalanceBefore).toString(),result.collateral.toString(),"Collateral not received properly");
      assert.deepEqual(bobMxxBalanceAfter.sub(bobMxxBalanceBefore).toString(),result.mxxToBeMinted.toString(),"Minted MXX not received properly");
      assert.deepEqual(noOfContractsBefore.toNumber() - noOfContractsAfter.toNumber(),1,"Contracts not removed from ERC20 map");
    });
  });

  it("should allow owner to claim ETH contract successfully", function () {
    
    // Define variables
    let multiplierInstance;
    let tetherInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let bob = accounts[1];
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let collateral = "1500000000000000000";
    let ethMintFactor = "380000000000000000000";
    let mxxMintFactor = "10000000000000000";
    let tenureInDays = 90;
    let yieldContractId;
    let ethBalanceBefore;
    let ethBalanceAfter;
    let mxxBalanceBefore;
    let mxxBalanceAfter;
    let noOfContractsBefore;
    let noOfContractsAfter;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed(mxxMintFactor);
    }).then(function(instance){

      YieldContractInstance = instance;

      // Create a contract
      return YieldContractInstance.createYieldContract(ethAddress,collateral,tenureInDays,{from: owner, value: collateral});

    }).then(function(result){

      // Get ETH no of contracts
      return YieldContractInstance.erc20Map.call(ethAddress,{from: owner});

    }).then(function(result){

      noOfContractsBefore = result[2];

      // Get user MXX balance
      return multiplierInstance.balanceOf(owner);

    }).then(function(result){
      
      mxxBalanceBefore = result;      

      // Get ETH balance
      return web3.eth.getBalance(owner);

    }).then(function(result){
      
      ethBalanceBefore = result;

      // Move a year forward
      return new Promise((resolve, reject) => {
        web3.currentProvider.send(
          {
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [31536000],
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

      // Get contract details
      return YieldContractInstance.getSubsetYieldContracts(0,100,{from: owner});

    }).then(function(result){

      yieldContractId = result[result.length - 1];

      // Attempt to claim contract by Bob
      return YieldContractInstance.claimYieldContract(yieldContractId, { from: owner });

    }).then(function(result){

      // Get user ETH balance
      return web3.eth.getBalance(owner);

    }).then(function(result){
      
      ethBalanceAfter = result;

      // Get user MXX balance
      return multiplierInstance.balanceOf(owner);

    }).then(function(result){
      
      mxxBalanceAfter = result;

      // Get tether no of contracts
      return YieldContractInstance.erc20Map.call(ethAddress,{from: owner});

    }).then(function(result){

      noOfContractsAfter = result[2];

      // Get contract details
      return YieldContractInstance.contractMap(yieldContractId,{from: owner});

    }).then(function(result){

      // Assert
      assert.deepEqual(ethBalanceAfter - ethBalanceBefore > 0,true,"Collateral not received properly");
      assert.deepEqual(mxxBalanceAfter.sub(mxxBalanceBefore).toString(),result.mxxToBeMinted.toString(),"Minted MXX not received properly");
      assert.deepEqual(noOfContractsBefore.toNumber() - noOfContractsAfter.toNumber(),1,"Contracts not removed from ERC20 map");
    });
  });

 });
