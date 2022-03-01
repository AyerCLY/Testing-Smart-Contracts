//Before deploying to Ethereum, it is best to test your smart contracts locally.
//You can do so by using a tool called Ganache, which sets up a local Ethereum network.
//Every time Ganache starts, it creates 10 test accounts and gives them 100 Ethers to make testing easier. 
//Since Ganache and Truffle are tightly integrated we can access these accounts through the accounts array 
//we've mentioned in the previous chapter.
    
//Build Artifacts
//Every time you compile a smart contract, the Solidity compiler generates a JSON file (referred to as build artifacts) 
//which contains the binary representation of that contract and saves it in the build/contracts folder.
//Next, when you run a migration, Truffle updates this file with the information related to that network.

//The first thing you'll need to do every time you start writing a new test suite is to load 
//the build artifacts of the contract you want to interact with. 
//This way, Truffle will know how to format our function calls in a way the contract will understand.

//Let's look at a simple example.
//Say there was a contract called MyAwesomeContract. We could do something like the following to load the build artifacts:
//const MyAwesomeContract = artifacts.require(“MyAwesomeContract”);

const CryptoZombies = artifacts.require("CryptoZombies);
                                            
//In order to keep our tests nice and tidy we've moved the code above to helpers/utils.js and imported it into “CryptoZombies.js” like so:
const utils = require("./helpers/utils");                                        

//Calling createRandomZombie requires us to pass it the zombie's name as a parameter. 
//So, the next step would be to give a name to Alice's zombie. Something like “Alice’s Awesome Zombie”.  
//However, if we do this for each test, our code is not going to look pretty. 
/*
A better approach is to initialize a global array as follows:
const zombieNames = ["Zombie #1", "Zombie #2"];

And then, call the contract's methods like so:
contractInstance.createRandomZombie(zombieNames[0]);
*/
//Note: Using an array to store zombies' names comes in handy if you want, for example, to write a test that creates 1000 zombies instead of just one or two😉.
//initialized the zombieNames array for you
const zombieNames = ["Zombie 1", "Zombie 2"];

//Usually, every test has the following phases:
//set up: in which we define the initial state and initialize the inputs.
//act: where we actually test the code. Always make sure you test only one thing.
//assert: where we check the results.


//The contract() function
//Behind the scenes, Truffle adds a thin wrapper around Mocha in order to make testing simpler. Since our course focuses on Ethereum development, we won't be spending much time explaining the bits and bytes of Mocha. If you're inclined to learn more about Mocha, check out their website, once you're done with this lesson. 
//For now, you only have to understand what we cover here - how to:
//1. group tests by calling a function named contract(). It extends Mocha's describe() by providing a list of accounts 
//for testing and doing some cleanup as well.
//2. contract() takes two arguments. The first one, a string, must indicate what we’re going to test. 
//The second parameter, a callback, is where we’re going to actually write our tests.
//3. execute them: the way we’ll be doing this is by calling a function named it() which also takes two arguments: 
//a string that describes what the test actually does and a callback.
/*
Putting it together, here's a bare-bones test:
 contract("MyAwesomeContract", (accounts) => {
   it("should be able to receive Ethers", () => {
   })
 })
*/
contract("CryptoZombies", (accounts) => {

     //1. initialize `alice` and `bob`
    let [alice, bob] = accounts;
    

    // creat hooks
    //Note: We want contractInstance to be limited in scope to the block in which it's defined. Use let instead of var.
    let contractInstance;
    
//A. Set up: in which we define the initial state and initialize the inputs.
//In Chapter 2, you learned to create a contract abstraction. 
//However, a contract abstraction, as its name says, is just an abstraction. 
//*****In order to actually interact with our smart contract, we have to create a JavaScript object 
//*****that will act as an instance of the contract. 
//Continuing our example with MyAwesomeContract, we can use the contract abstraction to initialize our instance like this:
//const contractInstance = await MyAwesomeContract.new(); 
    //Wouldn't be nice if you could write this just once and have Truffle run it automatically for every test?
    //So, instead of writing contract.new() several times, you just do it once like this:
   beforeEach(async () => {
        // let's put here the code that creates a new contract instance
        contractInstance = await CryptoZombies.new();        //remove "const" as hooks created
    });
    
    //The First Test- Creating a New Zombie
    //The first parameter passed to the it() function should be the name of our test.
    it("should be able to create a new zombie", async() => { 
    //2 & 3. Replace the first parameter and make the callback async   
    // Let's create an instance of our contract. Declare a new const named contractInstance,and set it equal to the result of the CryptoZombies.new() function.
    // remove it "const contractInstance = await CryptoZombies.new();" as "hooks" has been created in above 
        
//B. Act: where we actually test the code. Always make sure you test only one thing.
        //We've reached the part where we're going to be calling the function that creates a new zombie for Alice- createRandomZombie.
        //But there's a slight problem- how can we make it so the method "knows" who calls it? 
        //The following calls createRandomZombie and makes sure msg.sender is set to Alice's address: 
        //Use the zombie's name and the owner as arguments.
        const result = await contractInstance.createRandomZombie(zombieNames[0], {from:alice});

/*Logs and Events
Once we specified the contract we wanted to test using artifacts.require, Truffle automatically provides the logs generated by our 
smart contract. What this means is that we can now retrieve the name of Alice's newly created zombie using something like this: 

result.logs[0].args.name. In a similar fashion, we can get the id and the _dna.

Besides these bits of information, result is going to be giving us several other useful details about the transaction:
result.tx: the transaction hash
result.receipt: an object containing the transaction receipt. 
If result.receipt.status is equal to true it means that the transaction was successful. Otherwise, it means that the transaction failed.

Note: Note that logs can also be used as a much cheaper option to store data. 
The downside is that they can't be accessed from within the smart contract itself.
*/
        
//C. Assert: where we check the results.
        //If result.receipt.status is equal to true it means that the transaction was successful. 
        //Otherwise, it means that the transaction failed.
        assert.equal(result.receipt.status, true);
        //If the above condition is true, we can assume that our test has been passed. 
        //Just to be safe, let's add in one more check while we're here.
        assert.equal(result.logs[0].args.name,zombieNames[0]);
    })
    })

    //define the new it() function, the 2rd test
    it("should not allow two zombies", async () => {
        //First, let's have Alice create her first zombie. Give it zombieNames[0] as the name and don't forget to properly set the owner.
        await  contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        //In order to keep our tests nice and tidy we've moved the code above to 
        //helpers/utils.js and imported it into “CryptoZombies.js” like so:
        //And this is how the line of code that calls the function should look like:
        //await utils.shouldThrow(MyAwesomeContractInstance.myAwesomeFunction());
        await utils.shouldThrow(contractInstance.createRandomZombie(zombieNames[1], {from: alice}));
    })

/*
Now, we've gone ahead and run truffle test for you. Here's the output:

Contract: CryptoZombies
    ✓ should be able to create a new zombie (129ms)
    ✓ should not allow two zombies (148ms)


  2 passing (1s)
  
*/ 

   //To group tests, Truffle provides a function called context. Let me quickly show you how use it in order to better structure our code:
   context("with the single-step transfer scenario", async () => {
        it("should transfer a zombie", async () => {
          // we're going to be testing the scenario in which Alice transfers her ERC721 token to Bob, in a single step.
          //The first line of the function should call createRandomZombie. 
          //Give it zombieNames[0] as the name and make sure Alice is the owner.
          const result = await contractInstance.createRandomZombie(zombieNames[0], {from:alice});
          //The second line should declare a const named zombieId and set it equal to the zombie's id. 
            //In Chapter 5, you learned how to retrieve this piece of information. Refresh your memory, if needed.
            //we can retrieve the name of Alice's newly created zombie using something like this: result.logs[0].args.name. 
           //In a similar fashion, we can get the id and the _dna.
          const zombieId = result.logs[0].args.zombieId.toNumber();
          //Then, we have to call transferFrom with alice and bob as the first parameters. 
            //Make sure Alice calls this function and we're awaiting for it to finish running before moving to the next step
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

