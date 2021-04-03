const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

it("constructor sets position and default values for mode and generatorWatts", function() {
    expect( function() { new Rover();}).toThrow(new Error('Expect Position value'));
  });

it("response returned by receiveMessage contains name of message", function(){
  let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
  let message = new Message("Test message with two commands", commands);
  let rover = new Rover(98382);
  let response = rover.receiveMessage(message);
  expect(response.message).toEqual("Test message with two commands");
})

it("response returned by receiveMessage includes two results if two commands are sent in the message", function(){
  let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
  let message = new Message("Test message with two commands", commands);
  let rover = new Rover(98382);
  let response = rover.receiveMessage(message);
  expect(response.results.length).toEqual(commands.length);
})

it("responds correctly to status check command", function(){
  let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK'), new Command('MODE_CHANGE', 'NORMAL'), new Command('MOVE', 254)];
  let message = new Message("Test message with two commands", commands);
  let rover = new Rover(98382);
  let response = rover.receiveMessage(message); 
  expect(response.results[1].roverStatus.mode).toEqual("LOW_POWER");
  expect(response.results[3].roverStatus.position).toEqual(254);
  expect(response.results[0].roverStatus.generatorWatts).toEqual(110);
  
}) 
 

/*The test should check the completed property and rover mode for accuracy.
The rover has two modes that can be passed a values to a mode change command, 'LOW_POWER' and 'NORMAL'.
*/
it("responds correctly to mode change command", function(){
   let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK'), new Command('MOVE', 262), new Command('MODE_CHANGE', 'NORMAL')];
  let message = new Message("Test message with two commands", commands);
  let rover = new Rover(98382);
  let response = rover.receiveMessage(message);
 // console.log(response.results);
 // if(message.commands[0].commandType == 'MODE_CHANGE'){
  /*  console.log(message.commands[0]);
    console.log(message.commands[1]);
    console.log(message.commands[2]);
    console.log(message.commands[3]);
    console.log(response.results[0].roverStatus.mode);
    console.log(response.results[0].roverStatus);
     console.log(response.results[1].roverStatus);
      console.log(response.results[2].roverStatus);
       console.log(response.results[3].roverStatus);   */

    expect(response.results[0].completed).toEqual(true);
   // console.log(response.results[0]);
    expect(response.results[0].roverStatus.mode).toEqual('LOW_POWER');
    expect(response.results[3].roverStatus.mode).toEqual('NORMAL');
  
})

/*The test should check the completed property for accuracy and confirm that the rover position did not change.
Use the Rover Modes table for guidance on how to handle move commands in different modes. */

it("responds with false completed value when attempting to move in LOW_POWER mode", function(){
   let commands = [new Command('MODE_CHANGE', 'NORMAL'), new Command('STATUS_CHECK'), new Command('MOVE', 334502)];
  let message = new Message("Test message with two commands", commands);
  let rover = new Rover(24601);
  let response = rover.receiveMessage(message);
  
    expect(response.results[0].completed).toEqual(true)
    expect(response.results[2].roverStatus.position).toEqual(334502)
  
})

/*A MOVE command will update the rover's position with the position value in the command. */

it("responds with position for move command", function(){
   let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE'), new Command('MODE_CHANGE','NORMAL'), new Command('MOVE',2020)];
  let message = new Message("Test message with two commands", commands);
  let rover = new Rover(201);
  let response = rover.receiveMessage(message);
  if(message.commands[3].commandType === "MOVE"){
    expect(response.results[3].roverStatus.position).toEqual(2020)};
  if(message.commands[1].commandType === 'MOVE'){
    expect(response.results[1].completed).toEqual(false)
  }})
});