// This is a module export statement for exporting an object
module.exports = {
  // This is an object containing various settings
  settings: {
    prefix: '!', // the prefix for commands example, !help
    botName: 'BotOguz', // this is your bot name, it has to be the same in game
    owerName: 'Atekinz', // change this to the owner name
    ownerId: '6417b7c9b38fcbc2f504a811', // change this with the owner of the bot ID
    botId: '50a19b91e85fc78aecd7fa841df369d74fb000147f31929aa63a717995d9e266', // change this with your bot ID, you can get the bot id once you start the bot.
    developers: ['Atekinz'], // you can add as many as you want
    moderators: ['Changeme',
], // add as many as you want
    roomName: 'Changeme', // change this to your room name
    // change this to where you want the bot to teleport on start
    coordinates: {
      x: 3,
      y: 7,
      z: 1,
      facing: 'FrontLeft'
    },
    reactionName: 'wink' // the reaction you want to use to kick players, 'wink', 'wave, 'heart', 'clap', 'thumbsup'
  },
  // This is an object containing authentication data
  authentication: {
    room:"641c0f64aab6271b6fa7e4e0" , // your room ID can be found in highrise.game/room/
    token: "50a19b91e85fc78aecd7fa841df369d74fb000147f31929aa63a717995d9e266" // your token ID     you can get one from https://highrise.game
  }
}