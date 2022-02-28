    //Usually, every test has the following phases:
    //set up: in which we define the initial state and initialize the inputs.
    //act: where we actually test the code. Always make sure you test only one thing.
    //assert: where we check the results.
    
//A. Set up
//group tests by calling a function named contract(). It extends Mocha's describe() by providing a list of accounts for testing and doing some cleanup as well.
//contract() takes two arguments. The first one, a string, must indicate what we’re going to test. The second parameter, a callback, is where we’re going to actually write our tests.
//execute them: the way we’ll be doing this is by calling a function named it() which also takes two arguments: a string that describes what the test actually does and a callback.
//use the name of our contract
const CryptoZombies = artifacts.require("CryptoZombies);

//In order to keep our tests nice and tidy we've moved the code above to helpers/utils.js and imported it into “CryptoZombies.js” like so:
const utils = require("./helpers/utils");                                        
                                        
//initialized the zombieNames array for you
const zombieNames = ["Zombie 1", "Zombie 2"];

contract("CryptoZombies", (accounts) => {

    //Before deploying to Ethereum, it is best to test your smart contracts locally.
    //You can do so by using a tool called Ganache, which sets up a local Ethereum network.
    //Every time Ganache starts, it creates 10 test accounts and gives them 100 Ethers to make testing easier. 
    //Since Ganache and Truffle are tightly integrated we can access these accounts through the accounts array we've mentioned in the previous chapter.
    
    //1. initialize `alice` and `bob`
    let [alice, bob] = accounts;
    
    // creat hooks
    let contractInstance;

    beforeEach(async () => {
        // let's put here the code that creates a new contract instance
        contractInstance = await CryptoZombies.new();        //remove "const" as hooks created
    });
    
    //The first parameter passed to the it() function should be the name of our test.
    it("should be able to create a new zombie", async() => { //2 & 3. Replace the first parameter and make the callback async   
        // Let's create an instance of our contract. Declare a new const named contractInstance, and set it equal to the result of the CryptoZombies.new() function.
        // remove it "const contractInstance = await CryptoZombies.new();" as "hooks" has been created in above 
//B. Act
        //The following calls createRandomZombie and makes sure msg.sender is set to Alice's address: 
        //Use the zombie's name and the owner as arguments.
        const result = await contractInstance.createRandomZombie(zombieNames[0], {from:alice});
////C. Assert
        //If result.receipt.status is equal to true it means that the transaction was successful. Otherwise, it means that the transaction failed.
        assert.equal(result.receipt.status, true);
        //If the above condition is true, we can assume that our test has been passed. Just to be safe, let's add in one more check while we're here.
        assert.equal(result.logs[0].args.name,zombieNames[0]);

    })
    })

    //define the new it() function, the 2rd test
    it("should not allow two zombies", async () => {
        //First, let's have Alice create her first zombie. Give it zombieNames[0] as the name and don't forget to properly set the owner.
        await  contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        //await utils.shouldThrow(MyAwesomeContractInstance.myAwesomeFunction());
        await utils.shouldThrow(contractInstance.createRandomZombie(zombieNames[1], {from: alice}));
    })

   //To group tests, Truffle provides a function called context. Let me quickly show you how use it in order to better structure our code:
   context("with the single-step transfer scenario", async () => {
        it("should transfer a zombie", async () => {
          // we're going to be testing the scenario in which Alice transfers her ERC721 token to Bob, in a single step.
          //The first line of the function should call createRandomZombie. Give it zombieNames[0] as the name and make sure Alice is the owner.
          const result = await contractInstance.createRandomZombie(zombieNames[0], {from:alice});
          //The second line should declare a const named zombieId and set it equal to the zombie's id. In Chapter 5, you learned how to retrieve this piece of information. Refresh your memory, if needed.
          const zombieId = result.logs[0].args.zombieId.toNumber();
          //Then, we have to call transferFrom with alice and bob as the first parameters. Make sure Alice calls this function and we're awaiting for it to finish running before moving to the next step
          await contractInstance.transferFrom(alice, bob, zombieId, {from:alice});
          //Declare a const called newOwner. Set it equal to ownerOf called with zombieId.
          const newOwner = await contractInstance.ownerOf(zombieId);
          //Lastly, let's check whether Bob owns this ERC721 token. Putting this into code, it means we should run assert.equal with newOwner and bob as parameters;
          assert.equal(newOwner,bob);
        })
    })

    xcontext("with the two-step transfer scenario", async () => {
        it("should approve and then transfer a zombie when the approved address calls transferFrom", async () => {
        // TODO: Test the two-step scenario.  The approved address calls transferFrom
        })
        it("should approve and then transfer a zombie when the owner calls transferFrom", async () => {
            // TODO: Test the two-step scenario.  The owner calls transferFrom
        })
    })
    })

