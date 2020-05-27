const Discord = require('discord.js')
const bot = new Discord.Client();
const cheerio = require('cheerio')
const request = require('request')
const config = require('./config.json')

function checkDays(date) {
    let now = new Date();
    let diff = now.getTime() - date.getTime();
    let days = Math.floor(diff / 86400000);
    return days + (days == 1 ? " day" : " days") + " ago";
};

const PREFIX = 'fazzdev!';

bot.on('ready' , () =>{
    console.log('This bot is now online')
    bot.user.setActivity('fazz gang').catch(console.error);


    // Initialize Twitch Event Handler
    require('./TwitchEvents')(bot);
})
bot.on('presenceUpdate', (oldMember, newMember) => {
    const channel = oldMember.guild.channels.find(x => x.name === "stream-announcements");
    if (!channel) return;
        let oldStreamingStatus = oldMember.presence.game ? oldMember.presence.game.streaming : false;
        let newStreamingStatus = newMember.presence.game ? newMember.presence.game.streaming : false;

  if(oldStreamingStatus == newStreamingStatus){
    return;
  }

  if(newStreamingStatus){
        channel.send(`the faggot fazz is live twitch.tv/fazzc \n[@everyone]`);
    return; 
    }
});

bot.on('guildMemberAdd', member =>{
    const channel = member.guild.channels.find(channel => channel.name === "??welcome");
    if(!channel) return

    channel.send(`Welcome!, ${member}`)
});

const usedCommandRecently = new Set();

bot.on('message', msg=>{

    const ownerSent = (msg.author.id === '470180449163935744')
    const args = msg.content.slice(PREFIX.length).split(' ');
    if (!msg.content.startsWith(PREFIX)) return;

    switch(args[0]){
            case 'cursed':
                cursed(msg)
            break;
            
            case 'info':
                if(args[1] === 'version'){
                    msg.channel.sendMessage('This bot is in version 1.0.0')
                }else{
                    msg.channel.sendMessage(':no_entry_sign: | Please put a valid argument')
                }
                break;

                case 'warn':
            const mentionedUser = msg.mentions.users.first();
                    if(msg.member.hasPermission('KICK_MEMBERS')){
                        let reason = args.slice(2).join(' ')
                        mentionedUser.send(`**You were warned in ${msg.guild.name} for** : ` + reason)
                    }else {
                        msg.channel.sendMessage('Insufficient permission')
                    }
                break;

            case 'suggest':
                let suggestion = args.slice(1).join(' ')
                const suggestionChannel = bot.channels.find("name", "suggestionel")
                const suggestionMessage = new Discord.RichEmbed()
                .setTitle("**New** Suggestion:")
                .setDescription(`${suggestion}`)
                .setFooter(`by ${msg.author.username}`)
                .setThumbnail(msg.author.avatarURL)
                .setColor(0x00ff00)
                if(!suggestion.includes("https://")){
                    msg.channel.send(':mail: | Your **"suggestion"** has been sent to the developer!')
                    suggestionChannel.sendEmbed(suggestionMessage)
                }
                if(suggestion.includes("https://")){
                    msg.channel.send(':yousuf: nigga you aint gon rick roll me');
                }

            break;
            
                case 'pardon':
            const mentionedUser2 = msg.mentions.users.first();
                    if(msg.member.hasPermission('MANAGE_GUILD')){
                        let reason = args.slice(2).join(' ')
                        mentionedUser2.send(`**You were pardoned in ${msg.guild.name} for** : ` + reason)
                    }else {
                        msg.channel.sendMessage('You do not have enough permission')
                    }
                break;


                case 'ping':
                    msg.channel.sendMessage('Pong!')
                break;
               

                case 'status':
                    msg.channel.sendMessage('**Bot status** : :gear: Being developed on \n**Version** : 1.0.0')
                break;

                case 'clear':
                    if(msg.member.hasPermission('MANAGE_MESSAGES')) {
                        msg.channel.bulkDelete(args[1]);
                    }else {
                        msg.channel.sendMessage("Insufficient Permission")
                    }
                break;
				
				case 'nickChange':
				const mentionedNick = msg.mentions.users.first();
				let nick = args.slice(2).join(' ')
				msg.member.setNickname(`${nick}`)
				break;

        
                case 'userprofile':
                    const embed = new Discord.RichEmbed()
                    .setTitle('**User Information**')
                    .addField('User', msg.author.username)
                    .addField('Current Server', msg.guild.name)
                    .addField('User ID' , msg.author.id)
                    .setColor(0x00FFF8)
                    .setThumbnail(msg.author.avatarURL)
                    .setFooter('beep boop i am a bot')
                    msg.channel.sendEmbed(embed);
                break; 

                case 'help':
                    const help = new Discord.RichEmbed()
                    .setTitle('Commands')
                    .addField(`${PREFIX}userprofile**` , 'Shows your user profile')
                    .addField(`${PREFIX}help**` , 'shows this window')
                    .addField(`${PREFIX}status**` , 'shows status of the bot')
                    .addField(`${PREFIX}serverinfo**` , 'shows server info')
                    .addField(`${PREFIX}reaction**` , 'opens up the help menu for reaction commands')
                    .addField(`${PREFIX}staffhelp**` , 'Opens a section of help for staff members.')
                    .addField(`${PREFIX}avatar**` , 'shows avatar of mentioned user, if no user is mentioned than it shows your avatar')
                    .setColor(0x00FFF8)
                    
                    .setFooter('beep boop i am a bot')
                    msg.channel.sendEmbed(help);
                break;




                case 'serverinfo':
            const serverinfo = new Discord.RichEmbed()
            .setTitle('**Server Info**')
            .setAuthor(msg.guild.name , msg.guild.iconURL)
            .addField('Total members: ' , msg.guild.memberCount)
            .addField("Creation Date", `${msg.channel.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(msg.channel.guild.createdAt)})`, true)
            .setThumbnail(msg.guild.iconURL)

            .setColor(0x00FFF8)

            .setFooter('beep boop i am a bot')
            msg.channel.sendEmbed(serverinfo);

        break;



                case 'meme':
                    meme(msg)
                break;

                case 'kick':
                                if(msg.member.hasPermission('KICK_MEMBERS'))
                                {
                                    if(!args[1]) return msg.reply(':no_entry_sign: | Please enter a user to kick');
                                    const mentionedUserkick = msg.mentions.users.first();
                                    let kickReason = args.slice(2).join(' ')
                                    mentionedUserkick.send(`You have been kicked in ** ${msg.guild.name} ** for ` + kickReason)
                                    var member= msg.mentions.members.first();
                                    member.kick().then((member) => {
                                        msg.channel.send(member.displayName + " has been sent to a concentration camp ");
                                    })
                    
                               }else {
                                   msg.channel.sendMessage(':no_entry: | Insufficient Permission')
                               }
                            break;

                            case 'staffhelp':
                                if(msg.member.hasPermission('MANAGE_CHANNELS'))
                                {
                                    const staffhelp = new Discord.RichEmbed()
                                    .setTitle('Help commands for Staff')
                                    .addField(`${PREFIX} kick**' , 'Kicks members from server, requires manage guild'`)
                                    .addField(`${PREFIX} ban**' , 'Bans members from the discord, also needs manage guild perms'`)
                                    .addField(`${PREFIX} clear**' , 'Clears desired messages'`)
                                    .addField(`${PREFIX} warn**' , 'Warns member'`)
                                    .addField(`${PREFIX} pardon**' , 'Pardons user who was warned'`)
                                    .setFooter('beep boop i am a bot')
                                    msg.channel.sendEmbed(staffhelp)
                                }else {
                                    msg.channel.sendMessage(':no_entry_sign: | Insufficient Permission')
                                }
                            break;

                            case 'ban':
                                    if(msg.member.hasPermission('BAN_MEMBERS'))
                                    {
                                        if(!args[1]) return msg.reply(':no_entry_sign: | Please enter a user to ban');
                                        const mentionedUserBan = msg.mentions.users.first();
                                        let banReason = args.slice(2).join(' ')
                                        mentionedUserBan.send(`You have been banned in ** ${msg.guild.name} ** for ` + banReason)
                                        var member= msg.mentions.members.first();
                                        member.ban().then((member) => {
                                            msg.channel.send(member.displayName + " has been turned to ash. ");
                                        })
                                        
                                       

                                   }else {
                                       msg.channel.sendMessage(':no_entry: | Insufficient Permission')
                                   }


                                break;               

                case 'avatar': 
        if (!msg.mentions.users.size)
        {
            return msg.channel.send(`Your avatar: ${msg.author.displayAvatarURL}`);
        }
            const avatarList = msg.mentions.users.map(user => {
            return `${user.username}\'s avatar: ${user.displayAvatarURL}`;
        });
            msg.channel.send(avatarList);

        break;
            
    }
    
});

const http = require('http')
var server = http.createServer();
server.listen(process.env.PORT || 5000)

setInterval(function() {
    console.log("Pinged!")
}, 300000);


function CheckOnlineStatus()
{
  $.ajax({
    channelName : `fazzc`,
    url: "https://api.twitch.tv/kraken/streams/" + channelName,
    dataType: 'json',
    headers: {
      'Client-ID': `2lehd18zwt2wzt9v0skno3n4uqwe80`
    },

     success: function(channel)
    {
      const streamchannel = bot.channels.get("652188494025850911");
      if (channel["stream"] == null)
      {
        alert(null);
      } else {
        streamchannel.channel.sendMessage("This faggot streaming lol, https://twitch.tv/fazzc");
      }
    }
  });
}

(function wakeup() {
  require('open')('https://fazz-bot.herokuapp.com/', (err) => {
    if (err) throw err;
    console.log('Woke up!');
    setTimeout(wakeup, 1740000); //29m
  });
})()

bot.login(config.token);
