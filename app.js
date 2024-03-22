
const { Highrise } = require("highrise-js-sdk");
const { settings, authentication } = require("./config/config");

const bot = new Highrise(authentication.token, authentication.room);
const { generatePlayersLength,
       getUptime,
       getRandomEmote,
       getRandomWelcomeMessage
      } = require("./utils/utils");

// Event emitted when the bot has successfully connected to the chat server.
bot.on('ready', async (client) => {
  console.log(`${settings.botName}(${client}) is now online in ${settings.roomName} with ${await generatePlayersLength(bot)} players.`);
  bot.player.teleport(client, settings.coordinates.x,
    settings.coordinates.y, settings.coordinates.z,
    settings.coordinates.facing);
});

// Event emitted when a chat message is created.
bot.on('chatMessageCreate', async (user, message) => {
  console.log(`(chat): [${user.username}]: ${message}`);
  const prefix = settings.prefix;
  if (message.startsWith(`${prefix}kick`)) {
// kick an user command
    if (settings.moderators.includes(user.id)) {
      const args = message.split(' ');
      if (!args || args.length < 1) {
        return bot.message.send(`I did not understand what you said.\nExample: !kick @user`);
      }
      const userName = args[1];
      if (!userName) return bot.message.send(`incorrect username.\nExample: !kick @user`);
      const target = userName.replace('@', '');
      const userId =
        await bot.room.players.getId(target)
      try {
        if (!userId || userId.length === 0) {
          return bot.message.send(` ${target} is not here`);
        } else {
          await bot.player.kick(userId[0]);
          bot.message.send(`@${target} got kicked from the room by${user.username}`)
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      return bot.message.send(`You dont have the permissions to do that.`)
    }
  }
// "come" command to make the bot follow you
  if (message.startsWith(`${prefix}come`) && settings.moderators.includes(user.id)) {
    try {
      const myPosition = await bot.room.players.cache.position(user.id)
      console.log(`${myPosition.x} ${myPosition.y} ${myPosition.z} ${myPosition.facing}`)
 
      if ('entity_id' in myPosition) {
        return bot.whisper.send(user.id, `Sorry you can't summon the bot on entity.`);
      }

      bot.player.teleport(settings.botId, myPosition.x, myPosition.y, myPosition.z, myPosition.facing);

    } catch (error) {
 
      bot.whisper.send(user.id, `Something went wrong, please contact @Xion.3`)
      console.error(error)
    }
  }
//send a custom message by saying someone user name or saying a specific word (can be done multiple time, consult Examples.js)
  if (message.startsWith(`cafe`)) {
   bot.message.send(`tu cafe esta listo ${user.username} `);
  };
//get the bot uptime by saying '${prefix}uptime'
  if (message.startsWith(`${prefix}uptime`)) {
    bot.message.send(await getUptime());
  };
//get the bot ping by saying '${prefix}ping'
  if (message.startsWith(`${prefix}ping`)) {
    const latency = await bot.ping.get()
    bot.message.send(`🤖 My current ping is: ${latency}ms`)
  }
  // "personal emote command" works by saying '${prefix}emote name' you can add more emotes, consult emotes.json to get the emotes id
  const emotes = {
    '!dance1': 'dance-shoppingcart',
    '!dance2': 'idle_singing',
    '!dance3': 'emote-float',
    '!dance4': 'emote-teleporting',
    '!dance5': 'emote-snowangel',
    '!dance6': 'dance-tiktok10',
    '!dance7': 'dance-tiktok2',
    '!dance8': 'dance-tiktok9',
    '!dance9': 'dance-blackpink',
    '!dance10': 'emote-bow',
    '!dance11': 'emote-snake',
    '!dance12': 'emote-frog',
    '!dance13': 'dance-weird',
    '!dance14': 'emote-pose1',
    '!dance15': 'emote-pose3',
    '!dance16': 'emote-pose5',
    '!dance17': 'emote-pose7',
    '!dance18': 'emote-pose8',
    '!dance19': 'dance-pennywise',
    '!dance20': 'emote-swordfight',
    '!dance20': 'emoji-cursing',
    '!dance21': 'emote-greedy',
    '!dance22': 'emote-energyball',
    '!dance23': 'emote-charging',
    '!dance24': 'dance-shoppingcart',
    '!dance25': 'dance-macarena',
    '!dance26': 'emoji-celebrate',
    '!dance27': 'dance-russian',
    '!dance28': 'emote-snowball',
    '!dance39': 'emote-maniac',
    
}
  if (message.toLowerCase() in emotes) {

    bot.player.emote(user.id, emotes[message.toLowerCase()]);
  };
// "random emote for the all the room command" works by saying '${prefix}emote'
  if (message.startsWith(`${prefix}emote`)) {
    if (settings.moderators.includes(user.id)) {
      const players = await bot.room.players.fetch();
      const randomEmote = await getRandomEmote();
      players.forEach(async (player) => {
        const playerId = player[0].id;
        await bot.player.emote(playerId, randomEmote);
      });
    } else {
    }
  }
});

// Event emitted when a whisper message is created.
bot.on('whisperMessageCreate', (user, message) => {
  console.log(`(whisper)[${user.username}]: ${message}`);
// "Send a message by whispering the bot command" works by whispering to the bot '${prefix}your message'
  const prefix = settings.prefix;
  if (message.startsWith(prefix)) {
    const text = message.split(prefix)[1].trim();
    bot.message.send(text);
  }
});

// deneme link
const express = require('express');
const app = express();
const port = process.env.HTTP_PORT || 8080;

// Web sunucu
app.get('/', (req, res) => {
  res.send('staup');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Event emitted when an emote is created.
bot.on('emoteCreate', (sender, receiver, emote) => {
  console.log(`[emoteCreate]: ${sender.username} sent ${emote} to ${receiver.username}`);
});

// Event emitted when a reaction is created.
bot.on('reactionCreate', async (sender, receiver, reaction) => {
  console.log(`[reactionCreate]: ${sender.username} sent ${reaction} to ${receiver.username}`);
  if (settings.moderators.includes(sender.id) && reaction === settings.reactionName) {
    if (!settings.moderators.includes(receiver.id)) {
      bot.whisper.send(receiver.id, `You was kicked fromt the room, @${sender.username} kicked you`);
      await bot.player.kick(receiver.id);
    } else {
      bot.message.send(`The person you tried to ban is a moderator`)
    }
  }
});

// Event emitted when a tip reaction is created.
bot.on('tipReactionCreate', (sender, receiver, item) => {
  console.log(`[tipReactionCreate]: Tip reaction from ${sender.username} to ${receiver.username}: ${item.amount} ${item.type}`);
  bot.message.send(`@${sender.username} Tipped @${receiver.username} ${item.amount} ${item.type}`);
});

// Emitted when a player joins the room. add multiple welcome messages by consulting utils.js
bot.on('playerJoin', async (user) => {
  console.log(`[playerJoin]: ${user.username}(${user.id}) Hoşgeldin !`);

  if (user.username === 'OnurV') {
    bot.message.send("Yapımcım odaya katıldı ❤️")
  }
  const randomMessage = await getRandomWelcomeMessage()
  bot.message.send(randomMessage.replace('{{user}}', user.username))
});

//playerjoin
bot.on('playerJoin', (user) => {
  console.log(`[playerJoin]: ${user.username}(${user.id}) Odaya katıldı`);
  bot.message.send(`Quieres café @${user.username} ?`);
});

//deneme

// Emittd when a player leaves the room.
bot.on('playerLeave', (user) => {
  console.log(`[playerLeave]: ${user.username}(${user.id}) Left the room`);
  bot.message.send(`nos dejó @${user.username} `)
});

// Emitted when a player moves or teleports in the game.
bot.on('TrackPlayerMovement', (position) => {
  if ('x' in position && 'y' in position && 'z' in position && 'facing' in position) {
    console.log(`[TrackPlayerMovement]: ${user.username} moved to ${position.x}, ${position.y}, ${position.z}, ${position.facing}`);
  } else if ('entity_id' in position && 'anchor_ix' in position) {
    console.log(`[TrackPlayerMovement]: ${user.username} moved to anchor ${position.entity_id} at index ${position.anchor_ix}`);
  }
});