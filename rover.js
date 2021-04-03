class Rover {
  constructor(position, mode = 'NORMAL', generatorWatts = 110){
    this.position = position;
    this.mode = mode;
    this.generatorWatts = generatorWatts;
    if(!position){
      throw Error("Expect Position value");
    }
  }
  receiveMessage(message){
    let returnStatement = { 
      message: message.name,
      results: []
    }
    for(let i=0; i < message.commands.length; i++){
      returnStatement.results[i] = {completed:Boolean};
      let roverStatus = { 
        mode:this.mode,
        generatorWatts: this.generatorWatts,
        position: this.position
      }
      for(let command in message.commands){ 
        if(message.commands[i].commandType ==='STATUS_CHECK'){
          returnStatement.results[i].completed = true;
          returnStatement.results[i].roverStatus = roverStatus;
        } else if(message.commands[i].commandType ==='MODE_CHANGE'){
            returnStatement.results[i].completed = true;
            if(message.commands[i].value === 'LOW_POWER'){
              this.mode = message.commands[i].value;
              roverStatus.mode = this.mode
              roverStatus.mode = message.commands[i].value; 
              returnStatement.results[i].roverStatus = roverStatus;
            } else {
                this.mode = message.commands[i].value;
                roverStatus.mode = this.mode;
                returnStatement.results[i].roverStatus = roverStatus;
              }
          }else{
            returnStatement.results[i].completed = true;
            if(this.mode === 'NORMAL'){
              this.position = message.commands[i].value;
              roverStatus.position = this.position;
              returnStatement.results[i].roverStatus = roverStatus;
            }else{
                returnStatement.results[i].completed = false;
              }
            }
          }
      }         
    return returnStatement; 
  }
}

module.exports = Rover;

