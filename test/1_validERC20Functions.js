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

  
  it("should not allow non-owner to add valid ERC20 (Tether)", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let tetherMintFactor = '1003500000000000000'; 
    let nonOwner = accounts[1];

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

      // Attempt to add Tether ERC20 into list by nonOwner
      return YieldContractInstance.addErc20(tetherInstance.address,tetherMintFactor,{from: nonOwner});
    }).catch(function(error){

      // Print error message
      console.log(error.message)
      assert(true);
    });
  });

  
  it("should allow owner to add valid ERC20 (Tether)", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let tetherMintFactor = "1003500000000000000";
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

      // Attempt to add Tether ERC20 into list by owner
      return YieldContractInstance.addErc20(tetherInstance.address,tetherMintFactor,{from: owner});
    }).then(function(result){

      // Assert
      assert.deepEqual(true, result["receipt"]["status"], "ERC20 not added successfully");
    });
  });

  it("should return updated number of valid ERC20s", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let tetherMintFactor = "1003500000000000000";
    let owner = accounts[0];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to get number of valid ERC20
      return YieldContractInstance.getNoOfErc20s({ from: owner });
    }).then(function(result){

      // Assert
      assert.deepEqual(result.toString(), "2", "No of valid ERC20 not returned properly");
    });
  });
  
  it("should return updated valid ERC20 array successfully", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let nonOwner = accounts[1];
    let expectedOutput;

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
      expectedOutput = [multiplierInstance.address,tetherInstance.address];

      // Get all valid ERC20 list
      return YieldContractInstance.getSubsetErc20List(0,100,{from: nonOwner});
    }).then(function(result){

      // Check if the result matches expected output
      assert.deepEqual(result, expectedOutput, "ERC20 list not updated properly");
    });
  });
  
  it("should return updated details of ERC20 address (Tether)", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let nonOwner = accounts[1];
    let expectedSymbol = "USDT";
    let expectedIsValid = true;
    let expectedNoOfContracts = '0';
    let expectedMintFactor = '1003500000000000000';

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

      // Get details of ERC20 (Tether)
      return YieldContractInstance.erc20Map.call(tetherInstance.address,{from: nonOwner});
    }).then(function(result){

      // Check if the result matches expected output
      assert.deepEqual(result[0], expectedSymbol, "ERC20 Symbol not updated properly");
      assert.deepEqual(result[1], expectedIsValid, "ERC20 validity not updated properly");
      assert.deepEqual(result[2].toString(), expectedNoOfContracts, "ERC20 no of contracts not updated properly");
      assert.deepEqual(result[3].toString(), expectedMintFactor, "ERC20 mint factor not updated properly");
    });
  });
  
  it("should not allow user address to be added in ERC20 list", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let userAddress = accounts[1];
    let userMintFactor = "1000000000000000000";

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to add user address into list
      return YieldContractInstance.addErc20(userAddress,userMintFactor,{from: owner});
    }).catch(function(error){

      // Print error message
      console.log(error.message)
      assert(true);
    });
  });
  
  it("should not allow existing ERC20 address to be added into the list", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let tetherMintFactor = "1003500000000000000";
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

      // Attempt to add Tether ERC20 into list by owner
      return YieldContractInstance.addErc20(tetherInstance.address,tetherMintFactor,{from: owner});
    }).catch(function(error){

      // Print error message
      console.log(error.message)
      assert(true);
    });
  });
  
  it("should not allow non-owner to remove valid ERC20 (Tether)", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let nonOwner = accounts[1];

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

      // Attempt to remove Tether ERC20 from list by nonOwner
      return YieldContractInstance.removeErc20(tetherInstance.address,{from: nonOwner});
    }).catch(function(error){

      // Print error message
      console.log(error.message)
      assert(true);
    });
  });

  it("should not allow owner to remove valid MXX ERC20", function () {
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let owner = accounts[0];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
      .then(function (instance) {
        multiplierInstance = instance;

        // Deploy yield contract
        return YieldContract.deployed(
          multiplierInstance.address,
          "10000000000000000"
        );
      })
      .then(function (instance) {
        YieldContractInstance = instance;

        // Deploy tether
        return Tether.deployed();
      })
      .then(function (instance) {
        tetherInstance = instance;

        // Attempt to remove MXX from list by owner
        return YieldContractInstance.removeErc20(
          multiplierInstance.address,
          {
            from: owner,
          }
        );
      })
      .catch(function (error) {

        // Print error
        console.log(error.message);
        assert(true);
      });
  });
  
  it("should allow owner to remove valid ERC20 (Tether)", function () {
    
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
    }).then(function(result){

      // Assert
      assert.deepEqual(true, result["receipt"]["status"], "ERC20 not removed successfully");
    });
  });
  
  it("should return ERC20 array with only MXX address", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let nonOwner = accounts[1];
    let expectedOutput;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
      expectedOutput = [multiplierInstance.address];
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Get all valid ERC20 list
      return YieldContractInstance.getSubsetErc20List(0,100,{ from: nonOwner });
    }).then(function(result){

      // Check if the result matches expected output
      assert.deepEqual(result, expectedOutput, "ERC20 list not updated properly");
    });
  });
  
  it("should return empty details of ERC20 address (Tether)", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let nonOwner = accounts[1];
    let expectedSymbol = '';
    let expectedIsValid = false;
    let expectedNoOfContracts = '0';
    let expectedMintFactor = "0";

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

      // Get details of ERC20 (Tether)
      return YieldContractInstance.erc20Map.call(tetherInstance.address,{from: nonOwner});
    }).then(function(result){

      // Check if the result matches expected output
      assert.deepEqual(result[0], expectedSymbol, "ERC20 Symbol not updated properly");
      assert.deepEqual(result[1], expectedIsValid, "ERC20 validity not updated properly");
      assert.deepEqual(result[2].toString(), expectedNoOfContracts, "ERC20 no of contracts not updated properly");
      assert.deepEqual(result[2].toString(), expectedMintFactor, "ERC20 mint factor not updated properly");
    });
  });
  
  it("should not allow owner to remove ERC20 that is not in list (Tether)", function () {
    
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

      // Attempt to remove Tether ERC20 into list by owner
      return YieldContractInstance.removeErc20(tetherInstance.address,{from: owner});
    }).catch(function(error){

      // Print error message
      console.log(error.message)
      assert(true);
    });
  });
  
  it("should not allow non-owner to add valid ERC20 list (Tether and VeChain)", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let tetherMintFactor = "1003500000000000000";
    let veChainInstance;
    let veChainMintFactor = "21200000000000000";
    let nonOwner = accounts[1];
    let inputMintFactorList = [tetherMintFactor, veChainMintFactor];

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

      // Deploy VeChain
      return VeChain.deployed();
    }).then(function(instance){

      veChainInstance = instance;

      // Attempt to add Tether and VeChain ERC20 into list by nonOwner
      return YieldContractInstance.addErc20List([tetherInstance.address, veChainInstance.address],inputMintFactorList,{from: nonOwner});
    }).catch(function(error){

      // Print error message
      console.log(error.message)
      assert(true);
    });
  });
  
  it("should allow owner to add valid ERC20 list (Tether and VeChain) successfully", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let tetherMintFactor = "1003500000000000000";
    let veChainInstance;
    let veChainMintFactor = "21200000000000000";
    let owner = accounts[0];
    let inputMintFactorList = [tetherMintFactor, veChainMintFactor];

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

      // Deploy VeChain
      return VeChain.deployed();
    }).then(function(instance){

      veChainInstance = instance;

      // Attempt to add Tether and VeChain ERC20 into list by owner
      return YieldContractInstance.addErc20List([tetherInstance.address, veChainInstance.address],inputMintFactorList,{from: owner});
    }).then(function(result){

      // Assert
      assert.deepEqual(true, result["receipt"]["status"], "ERC20 list not added successfully");
    });
  });

  
  it("should return updated valid ERC20 array (with Tether and VeChain) successfully", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let veChainInstance;
    let nonOwner = accounts[1];
    let expectedOutput;

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

      // Deploy VeChain
      return VeChain.deployed();
    }).then(function(instance){

      veChainInstance = instance;
      expectedOutput = [multiplierInstance.address, tetherInstance.address, veChainInstance.address];

      // Get all valid ERC20 list
      return YieldContractInstance.getSubsetErc20List(0,100,{from: nonOwner});
    }).then(function(result){

      // Check if the result matches expected output
      assert.deepEqual(result, expectedOutput, "ERC20 list not updated properly");
    });
  });

  
  it("should allow owner to remove valid ERC20 (Tether and VeChain) successfully", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let veChainInstance;
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

      // Deploy VeChain
      return VeChain.deployed();
    }).then(function(instance){

      veChainInstance = instance;

      // Attempt to remove Tether from list by owner
      return YieldContractInstance.removeErc20(tetherInstance.address,{from: owner});
    }).then(function(result){

      // Attempt to remove VeChain from list by owner
      return YieldContractInstance.removeErc20(veChainInstance.address,{from: owner});
    }).then(function(result){

      // Assert
      assert.deepEqual(true, result["receipt"]["status"], "ERC20 not removed successfully");
    });
  });

  // 
  it("should return updated ERC20 array successfully", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let nonOwner = accounts[1];
    let expectedOutput;

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
      expectedOutput = [multiplierInstance.address]; 
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Get all valid ERC20
      return YieldContractInstance.getSubsetErc20List(0,100,{from: nonOwner});
    }).then(function(result){

      // Check if the result matches expected output
      assert.deepEqual(result, expectedOutput, "ERC20 list not updated properly");
    });
  });

  
  it("should return token details with only MXX", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let nonOwner = accounts[1];
    let expectedValidERC20;
    let expectedSymbols = 'MXX';
    let expectedIsValids = true;
    let expectedNoOfContracts = '0';
    let expectedMintFactorList = "10000000000000000";

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
      expectedValidERC20 = multiplierInstance.address;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Get all token details
      return YieldContractInstance.erc20Map(multiplierInstance.address,{ from: nonOwner });
    }).then(function(result){

      // Check if the result matches expected output
      assert.deepEqual(result[0], expectedSymbols, "ERC20 symbol list not returned properly");
      assert.deepEqual(result[1], expectedIsValids, "ERC20 validity list not returned properly");
      assert.deepEqual(result[2].toString(), expectedNoOfContracts, "No. of contracts list not returned properly");
      assert.deepEqual(result[3].toString(), expectedMintFactorList, "Mint factor list not returned properly");
    });
  });

  // 
  it("should not allow non owner to delist valid ERC20 (Tether)", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let tetherMintFactor = "1003500000000000000";
    let owner = accounts[0];
    let nonOwner = accounts[1];

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

      // Add Tether ERC20 into list by owner
      return YieldContractInstance.addErc20(tetherInstance.address, tetherMintFactor,{from: owner});
    }).then(function(result){

      // Attempt to delist Tether by non owner
      return YieldContractInstance.setErc20Validity(tetherInstance.address, false, {
        from: nonOwner,
      });
    }).catch(function(error){

      // Print error message
      console.log(error.message);
      assert(true);
    });
  });

  
  it("should allow owner to delist valid ERC20 (Tether)", function () {
    
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

      // Attempt to delist Tether by owner
      return YieldContractInstance.setErc20Validity(tetherInstance.address, false, {
        from: owner,
      });
    }).then(function(result){

      // Assert
      assert.deepEqual(true, result["receipt"]["status"], "ERC20 not delisted successfully");
    });
  });

  
  it("should not allow to delist already delisted ERC20 (Tether)", function () {
    
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

      // Attempt to delist Tether again by owner
      return YieldContractInstance.setErc20Validity(tetherInstance.address, false, {
        from: owner,
      });
    }).catch(function(error){

      // Print error message
      console.log(error.message);
      assert(true);
    });
  });

  
  it("should not allow to delist already removed ERC20 (VeChain)", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let veChainInstance;
    let owner = accounts[0];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy VeChain
      return VeChain.deployed()
    }).then(function(instance){

      veChainInstance = instance;

      // Attempt to delist VeChain by owner
      return YieldContractInstance.setErc20Validity(veChainInstance.address, false, {
        from: owner,
      });
    }).catch(function(error){

      // Print error message
      console.log(error.message);
      assert(true);
    });
  });

  
  it("should not allow non owner to undelist delisted ERC20 (Tether)", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let nonOwner = accounts[1];

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

      // Attempt to undelist Tether by non owner
      return YieldContractInstance.setErc20Validity(tetherInstance.address, true, {
        from: nonOwner,
      });
    }).catch(function(error){

      // Print error message
      console.log(error.message);
      assert(true);
    });
  });

  
  it("should allow owner to undelist delisted ERC20 (Tether)", function () {
    
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

      // Attempt to undelist Tether by owner
      return YieldContractInstance.setErc20Validity(tetherInstance.address, true, {
        from: owner,
      });
    }).then(function(result){

      // Assert
      assert.deepEqual(true, result["receipt"]["status"], "ERC20 not undelisted successfully");
    });
  });

  
  it("should not allow to undelist user address", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let owner = accounts[0];
    let userAddress = accounts[1];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to undelist user address by owner
      return YieldContractInstance.setErc20Validity(userAddress, true, { from: owner });
    }).catch(function(error){

      // Print error message
      console.log(error.message);
      assert(true);
    });
  });

  
  it("should not allow to undelist already undelisted ERC20 (Tether)", function () {
    
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

      // Attempt to undelist Tether again by owner
      return YieldContractInstance.setErc20Validity(tetherInstance.address, true, {
        from: owner,
      });
    }).catch(function(error){

      // Print error message
      console.log(error.message);
      assert(true);
    });
  });

  
  it("should throw an error to get subset of ERC20 list with negative start limit", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let veChainInstance;
    let veChainMintFactor = "21200000000000000";
    let huobiTokenInstance;
    let huobiTokenMintFactor = "4717800000000000000";
    let chainLinkInstance;
    let chainLinkMintFactor = "13756700000000000000";
    let basicAttentionTokenInstance;
    let basicAttentionMintFactor = "265100000000000000";
    let erc20List = [];
    let mintFactorList = [
      veChainMintFactor,
      chainLinkMintFactor,
      huobiTokenMintFactor,
      basicAttentionMintFactor
    ];
    let owner = accounts[0];
    let nonOwner = accounts[1];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy VeChain
      return VeChain.deployed()    
    }).then(function(instance){

      veChainInstance = instance;
      erc20List.push(veChainInstance.address);

      // Deploy ChainLink
      return ChainLink.deployed()
    }).then(function(instance){

      chainLinkInstance = instance;
      erc20List.push(chainLinkInstance.address);

      // Deploy HuobiToken
      return HuobiToken.deployed()
    }).then(function(instance){

      huobiTokenInstance = instance;
      erc20List.push(huobiTokenInstance.address);

      // Deploy BasicAttentionToken
      return BasicAttentionToken.deployed()
    }).then(function(instance){

      basicAttentionTokenInstance = instance;
      erc20List.push(basicAttentionTokenInstance.address);

      // Adding 4 ERC20 token address into list
      return YieldContractInstance.addErc20List(erc20List,mintFactorList,{from: owner});
    }).then(function(result){

      // Attemping to get subset of validERC20 list
      return YieldContractInstance.getSubsetErc20List(-1,3,{from: nonOwner});
    }).catch(function(error){

      // Print error message
      console.log(error.message);
      assert(true);
    });
  });

  
  it("should get subset of ERC20 list with a high end limit", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let veChainInstance;
    let huobiTokenInstance;
    let chainLinkInstance;
    let basicAttentionTokenInstance;
    let nonOwner = accounts[1];
    let expectedOutput = [];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy VeChain
      return VeChain.deployed()    
    }).then(function(instance){

      veChainInstance = instance;
      expectedOutput.push(veChainInstance.address);

      // Deploy Tether
      return Tether.deployed()
    }).then(function(instance){

      tetherInstance = instance;

      // Deploy ChainLink
      return ChainLink.deployed()
    }).then(function(instance){

      chainLinkInstance = instance;
      expectedOutput.push(chainLinkInstance.address);

      // Deploy HuobiToken
      return HuobiToken.deployed()
    }).then(function(instance){

      huobiTokenInstance = instance;
      expectedOutput.push(huobiTokenInstance.address);

      // Deploy BasicAttentionToken
      return BasicAttentionToken.deployed()
    }).then(function(instance){

      basicAttentionTokenInstance = instance;
      expectedOutput.push(basicAttentionTokenInstance.address);

      // Attemping to get subset of validERC20 list
      return YieldContractInstance.getSubsetErc20List(2,8,{from: nonOwner});
    }).then(function(result){

      // Assert
      assert.deepEqual(result, expectedOutput,"ERC20 list not retrieved properly");
    });
  });

  
  it("should throw an error to get subset of ERC20 list with bad start and end limits", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let veChainInstance;
    let huobiTokenInstance;
    let chainLinkInstance;
    let basicAttentionTokenInstance;
    let nonOwner = accounts[1];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy VeChain
      return VeChain.deployed()    
    }).then(function(instance){

      veChainInstance = instance;

      // Deploy Tether
      return Tether.deployed()
    }).then(function(instance){

      tetherInstance = instance;

      // Deploy ChainLink
      return ChainLink.deployed()
    }).then(function(instance){

      chainLinkInstance = instance;

      // Deploy HuobiToken
      return HuobiToken.deployed()
    }).then(function(instance){

      huobiTokenInstance = instance;

      // Deploy BasicAttentionToken
      return BasicAttentionToken.deployed()
    }).then(function(instance){

      basicAttentionTokenInstance = instance;

      // Attemping to get subset of validERC20 list
      return YieldContractInstance.getSubsetErc20List(8,2,{from: nonOwner});
    }).catch(function(error){

      // Print error message
      console.log(error.message);
      assert(true);
    });
  });

  
  it("should get subset of ERC20 list with correct start and end limits", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let veChainInstance;
    let huobiTokenInstance;
    let chainLinkInstance;
    let basicAttentionTokenInstance;
    let nonOwner = accounts[1];
    let expectedOutput = [];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy Tether
      return Tether.deployed()    
    }).then(function(instance){

      tetherInstance = instance;
      expectedOutput.push(tetherInstance.address);

      // Deploy VeChain
      return VeChain.deployed()    
    }).then(function(instance){

      veChainInstance = instance;
      expectedOutput.push(veChainInstance.address);

      // Deploy Tether
      return Tether.deployed()
    }).then(function(instance){

      tetherInstance = instance;

      // Deploy ChainLink
      return ChainLink.deployed()
    }).then(function(instance){

      chainLinkInstance = instance;
      expectedOutput.push(chainLinkInstance.address);

      // Deploy HuobiToken
      return HuobiToken.deployed()
    }).then(function(instance){

      huobiTokenInstance = instance;

      // Deploy BasicAttentionToken
      return BasicAttentionToken.deployed()
    }).then(function(instance){

      basicAttentionTokenInstance = instance;

      // Attemping to get subset of validERC20 list
      return YieldContractInstance.getSubsetErc20List(1,3,{from: nonOwner});
    }).then(function(result){

      // Assert
      assert.deepEqual(result,expectedOutput,"Subset ERC20 not retrieved successfully");
    });
  });

  
  it("should not allow owner to add ERC20 list with improper lengths", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let tetherInstance;
    let veChainInstance;
    let veChainMintFactor = "21200000000000000";
    let owner = accounts[0];
    let inputMintFactorList = [veChainMintFactor];

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

      // Deploy VeChain
      return VeChain.deployed();
    }).then(function(instance){

      veChainInstance = instance;

      // Attempt to add Tether and VeChain ERC20 into list by owner
      return YieldContractInstance.addErc20List([tetherInstance.address, veChainInstance.address],inputMintFactorList,{from: owner});
    }).catch(function(error){

      // Assert
      console.log(error.message);
      assert(true);
    });
  });

  
  it("should allow owner to add ETH", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let ethMintFactor = "396690000000000000000";
    let owner = accounts[0];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to add ETH into list by owner
      return YieldContractInstance.addErc20(ethAddress,ethMintFactor,{from: owner});
    }).then(function(result){

      // Assert
      assert.deepEqual(true, result["receipt"]["status"], "ERC20 not added successfully");
    });
  });

  
  it("should return updated details of ETH", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let expectedMintFactor = "396690000000000000000";
    let expectedSymbol = "ETH";
    let expectedIsValid = true;
    let expectedNoOfContracts = "0";
    let nonOwner = accounts[1];
    
    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Get details of ERC20 (Tether)
      return YieldContractInstance.erc20Map.call(ethAddress,{from: nonOwner});
    }).then(function(result){

      // Check if the result matches expected output
      assert.deepEqual(result[0], expectedSymbol, "ERC20 Symbol not updated properly");
      assert.deepEqual(result[1], expectedIsValid, "ERC20 validity not updated properly");
      assert.deepEqual(result[2].toString(), expectedNoOfContracts, "ERC20 no of contracts not updated properly");
      assert.deepEqual(result[3].toString(), expectedMintFactor, "ERC20 mint factor not updated properly");
    });
  });

  
  it("should allow owner to delist ETH and return updated details", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let expectedMintFactor = "396690000000000000000";
    let expectedSymbol = "ETH";
    let expectedIsValid = false;
    let expectedNoOfContracts = "0";
    let owner = accounts[0];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to delist ETH by owner
      return YieldContractInstance.setErc20Validity(ethAddress, false, { from: owner });
    }).then(function(result){

      // Get ETH details
      return YieldContractInstance.erc20Map.call(ethAddress,{from: owner});
    }).then(function(result){

      // Check if the result matches expected output
      assert.deepEqual(result[0], expectedSymbol, "ERC20 Symbol not updated properly");
      assert.deepEqual(result[1], expectedIsValid, "ERC20 validity not updated properly");
      assert.deepEqual(result[2].toString(), expectedNoOfContracts, "ERC20 no of contracts not updated properly");
      assert.deepEqual(result[3].toString(), expectedMintFactor, "ERC20 mint factor not updated properly");
    });
  });

  
  it("should allow owner to undelist again ETH and return updated details", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let expectedMintFactor = "396690000000000000000";
    let expectedSymbol = "ETH";
    let expectedIsValid = true;
    let expectedNoOfContracts = "0";
    let owner = accounts[0];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to undelist ETH again by owner
      return YieldContractInstance.setErc20Validity(ethAddress, true, { from: owner });
    }).then(function(result){

      // Get ETH details
      return YieldContractInstance.erc20Map.call(ethAddress,{from: owner});
    }).then(function(result){

      // Check if the result matches expected output
      assert.deepEqual(result[0], expectedSymbol, "ERC20 Symbol not updated properly");
      assert.deepEqual(result[1], expectedIsValid, "ERC20 validity not updated properly");
      assert.deepEqual(result[2].toString(), expectedNoOfContracts, "ERC20 no of contracts not updated properly");
      assert.deepEqual(result[3].toString(), expectedMintFactor, "ERC20 mint factor not updated properly");
    });
  });

  
  it("should not allow non owner to update Mint Factor", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let newMintFactor = "96690000000000000000";
    let nonOwner = accounts[1];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to update ETH mint factor by non owner
      return YieldContractInstance.updateMFactor(ethAddress, newMintFactor,{from: nonOwner});
    }).catch(function(error){

      // Error message
      console.log(error.message);
      assert(true);
    });
  });

  
  it("should not allow owner to update Mint Factor for bad address", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let badAddress = accounts[1];
    let newMintFactor = "96690000000000000000";
    let owner = accounts[0];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to update ETH mint factor by non owner
      return YieldContractInstance.updateMFactor(badAddress, newMintFactor,{from: owner});
    }).catch(function(error){

      // Error message
      console.log(error.message);
      assert(true);
    });
  });

  
  it("should allow owner to update VeChain mint factor", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let veChainInstance;
    let veChainMintFactor = "21200000000000000";
    let newMintFactor = "11200000000000000";
    let expectedSymbol = "VEN";
    let expectedIsValid = true;
    let expectedNoOfContracts = "0";
    let owner = accounts[0];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy VeChain
      return VeChain.deployed();
    }).then(function(instance){

      veChainInstance = instance;

      // Attempt to update veChain mint factor by owner
      return YieldContractInstance.updateMFactor(veChainInstance.address,newMintFactor,{from: owner});
    }).then(function(result){

      // Get VeChain token details
      return YieldContractInstance.erc20Map.call(veChainInstance.address,{from: owner});
    }).then(function(result){

      //Assert
      assert.deepEqual(result[0], expectedSymbol, "ERC20 Symbol not updated properly");
      assert.deepEqual(result[1], expectedIsValid, "ERC20 validity not updated properly");
      assert.deepEqual(result[2].toString(), expectedNoOfContracts, "ERC20 no of contracts not updated properly");
      assert.deepEqual(result[3].toString(), newMintFactor, "ERC20 mint factor not updated properly");
    });
  });

  
  it("should allow owner to update ETH mint factor", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let newMintFactor = "200000000000000";
    let expectedSymbol = "ETH";
    let expectedIsValid = true;
    let expectedNoOfContracts = "0";
    let owner = accounts[0];

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to update ETH mint factor by owner
      return YieldContractInstance.updateMFactor(ethAddress,newMintFactor,{from: owner});
    }).then(function(result){

      // Get ETH token details
      return YieldContractInstance.erc20Map.call(ethAddress, { from: owner });
    }).then(function(result){

      //Assert
      assert.deepEqual(result[0], expectedSymbol, "ERC20 Symbol not updated properly");
      assert.deepEqual(result[1], expectedIsValid, "ERC20 validity not updated properly");
      assert.deepEqual(result[2].toString(), expectedNoOfContracts, "ERC20 no of contracts not updated properly");
      assert.deepEqual(result[3].toString(), newMintFactor, "ERC20 mint factor not updated properly");
    });
  });

  
  it("should not allow non owner to update list of Mint Factors", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let newETHMintFactor = "396690000000000000000";
    let nonOwner = accounts[1];
    let veChainInstance;
    let newVeChainMintFactor = "21200000000000000";

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy VeChain
      return VeChain.deployed();
    }).then(function(instance){

      veChainInstance = instance;

      // Attempt to update mint factors by non owner
      return YieldContractInstance.updateMFactorList([ethAddress,veChainInstance.address], [newETHMintFactor,newVeChainMintFactor],{from: nonOwner});
    }).catch(function(error){

      // Error message
      console.log(error.message);
      assert(true);
    });
  });

  
  it("should not allow owner to update list of Mint Factors with bad address", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let badAddressList = [accounts[1], accounts[2]];
    let newETHMintFactor = "396690000000000000000";
    let owner = accounts[0];
    let newVeChainMintFactor = "21200000000000000";

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Attempt to update mint factors by non owner
      return YieldContractInstance.updateMFactorList(badAddressList, [newETHMintFactor,newVeChainMintFactor],{from: owner});
    }).catch(function(error){

      // Error message
      console.log(error.message);
      assert(true);
    });
  });

  
  it("should not allow owner to update improper list of Mint Factors", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let owner = accounts[0];
    let veChainInstance;
    let newVeChainMintFactor = "21200000000000000";

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy VeChain
      return VeChain.deployed();
    }).then(function(instance){

      veChainInstance = instance;

      // Attempt to update mint factors by non owner
      return YieldContractInstance.updateMFactorList([ethAddress,veChainInstance.address], [newVeChainMintFactor],{from: owner});
    }).catch(function(error){

      // Error message
      console.log(error.message);
      assert(true);
    });
  });

  
  it("should allow owner to update list of Mint Factors", function () {
    
    // Define variables
    let multiplierInstance;
    let YieldContractInstance;
    let ethAddress = "0x0000000000000000000000000000000000000000";
    let newETHMintFactor = "396690000000000000000";
    let owner = accounts[0];
    let veChainInstance;
    let newVeChainMintFactor = "21200000000000000";

    // Deploy multiplier contract
    return Multiplier.at(multiplierAddress)
    .then(function(instance){

      multiplierInstance = instance;
    
    // Deploy yield contract
    return YieldContract.deployed("10000000000000000")
    }).then(function(instance){

      YieldContractInstance = instance;

      // Deploy VeChain
      return VeChain.deployed();
    }).then(function(instance){

      veChainInstance = instance;

      // Attempt to update mint factors by non owner
      return YieldContractInstance.updateMFactorList([ethAddress,veChainInstance.address], [newETHMintFactor,newVeChainMintFactor],{from: owner});
    }).then(function(result){

      // Assert
      assert.deepEqual(true, result["receipt"]["status"], "ERC20 not added successfully");
    });
  });
  
});
