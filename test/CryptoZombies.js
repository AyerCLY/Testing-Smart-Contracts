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
       //CryptoZombies.new() "talks" to the blockchain. This means that it's an asynchronous function. Let's add the await keyword before the function call.
       /*
       在 ES7 裡頭 async 的本質是 promise 的語法糖 ( 包裝得甜甜的比較好吃下肚 )，只要 function 標記為 async，就表示裡頭可以撰寫 await 的同步語法，
       而 await 顧名思義就是「等待」，它會確保一個 promise 物件都解決 ( resolve ) 或出錯 ( reject ) 後才會進行下一步，當 async function 的內容全都結束後，
       會返回一個 promise，這表示後方可以使用.then語法來做連接，基本的程式長相就像下面這樣：
       async function a(){
          await b();
          .....       // 等 b() 完成後才會執行
          await c();
          .....       // 等 c() 完成後才會執行
          await new Promise(resolve=>{
            .....
          });
          .....       // 上方的 promise 完成後才會執行
        }
        a();
        a().then(()=>{
          .....       // 等 a() 完成後接著執行
        });
       */
        contractInstance = await CryptoZombies.new();        //remove "const" as hooks created
    });
    
    //The First Test- Creating a New Zombie
    //The first parameter passed to the it() function should be the name of our test.
    //The second parameter (a callback function) is going to "talk" to the blockchain, which means that the function is asynchronous. 
    //Just prepend the async keyword. This way, every time this function gets called with the await keyword, our test waits for it to return.
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
          const zombieId = result.logs[0].args.zombieId.toNumber(); //why "toNumber" refer to zombie's id?
          //Then, we have to call transferFrom with alice and bob as the first parameters. 
            //Make sure Alice calls this function and we're awaiting for it to finish running before moving to the next step
          await contractInstance.transferFrom(alice, bob, zombieId, {from:alice});
          //Declare a const called newOwner. Set it equal to ownerOf called with zombieId.
          const newOwner = await contractInstance.ownerOf(zombieId);
          //Lastly, let's check whether Bob owns this ERC721 token. Putting this into code, it means we should run assert.equal with newOwner and bob as parameters;
          assert.equal(newOwner,bob);
        })
    })

    context("with the two-step transfer scenario", async () => {
        it("should approve and then transfer a zombie when the approved address calls transferFrom", async () => {
    //Alice creates a new ERC721 token and then calls approve.
            const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
            const zombieId = result.logs[0].args.zombieId.toNumber();
            await contractInstance.approve(bob, zombieId, {from: alice});
    //Next, Bob runs transferFrom which should make him the owner of the EC721 token.
            await contractInstance.transferFrom(alice, bob, zombieId, {from: bob});
            const newOwner = await contractInstance.ownerOf(zombieId);
    //Finally, we have to call assert.equal with newOwner and bob as parameters.
            assert.equal(newOwner,bob);
        })
//Copy and paste the code from the previous test and have Alice call transferFrom.
        it("should approve and then transfer a zombie when the owner calls transferFrom", async () => {
            const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
            const zombieId = result.logs[0].args.zombieId.toNumber();
            await contractInstance.approve(bob, zombieId, {from: alice});
            await contractInstance.transferFrom(alice, bob, zombieId, {from: alice});
            const newOwner = await contractInstance.ownerOf(zombieId);
            assert.equal(newOwner,bob);
        })
/*
This test is pretty straightforward and consists of the following steps:

First, we're going to be creating two new zombies - one for Alice and the other one for Bob.
Second, Alice will run attack on her zombie with Bob's zombieId as a parameter
Finally, for the test to pass, we are going to check if result.receipt.status equals true
While we're here, let's say I've quickly coded all this logic, wrapped it in an it() function, and run truffle test.

Our test just failed☹️.

But why?

Let's figure it out. First, we're going to take a closer look at the code behind createRandomZombie():

function createRandomZombie(string _name) public {
  require(ownerZombieCount[msg.sender] == 0);
  uint randDna = _generateRandomDna(_name);
  randDna = randDna - randDna % 100;
  _createZombie(_name, randDna);
}
So far so good. Moving forward, let's dig into _createZombie():

function _createZombie(string _name, uint _dna) internal {
  uint id = zombies.push(Zombie(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
  zombieToOwner[id] = msg.sender;
  ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].add(1);
  emit NewZombie(id, _name, _dna);
}
Ohh, you see the issue?

Our test failed because we've added a cooldown period to our game, and made it so zombies have to wait 1 day after attacking (or feeding) to attack again.
*/
    it("zombies should be able to attack another zombie", async () => {
        let result;
        result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        const firstZombieId = result.logs[0].args.zombieId.toNumber();
        result = await contractInstance.createRandomZombie(zombieNames[1], {from: bob});
        const secondZombieId = result.logs[0].args.zombieId.toNumber(); //why logs[0]?not duplicate?
        //TODO: increase the time
        //evm_increaseTime: increases the time for the next block.
        //evm_mine: mines a new block.
        /*
        Let me explain how these functions work:

        Every time a new block gets mined, the miner adds a timestamp to it. Let's say the transactions that created our zombies got mined in block 5.

        Next, we call evm_increaseTime but, since the blockchain is immutable, there is no way of modifying an existing block. So, when the contract checks the time, it will not be increased.

        If we run evm_mine, block number 6 gets mined (and timestamped) which means that, when we put the zombies to fight, the smart contract will "see" that a day has passed.

        Putting it together, we can fix our test by traveling through time as follows:

        await web3.currentProvider.sendAsync({
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [86400],  // there are 86400 seconds in a day
        id: new Date().getTime()
        }, () => { });

        Yeah, that’s a nice piece of code, but we wouldn’t want to add this logic to our CryptoZombies.js file.

        We’ve gone ahead and moved everything to a new file named helpers/time.js. To increase the time, you'll simply have to call: time.increaseTime(86400);
        */
        await time.increase(time.duration.days(1))
        await contractInstance.attack(firstZombieId, secondZombieId, {from: alice});
        assert.equal(result.receipt.status, true);
    })
})        
        



