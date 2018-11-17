const Discord = require("discord.js");
const client = new Discord.Client();
const moment = require("moment");
const fs = require("fs");
const prefix = 'h';
var Canvas = require('canvas');
var jimp = require('jimp');
const dateFormat = require('dateformat');
let points = JSON.parse(fs.readFileSync(`./points.json`, `utf8`))
var ownerid = '455331653309562910';
var dat = JSON.parse("{}");
//////////////////////////////////////////////////////////////////////////////////////////////////
client.on('ready' , () => {
    console.log('Human .. Online.');
client.user.setActivity('Human .. Online', {type:'idle' });
});
//////////////////////////////////////////////////////////////////////////////////////////////////

client.on("ready", () => {
    var guild;
    while (!guild)
        guild = client.guilds.find("name", 'Fucck Off..')
    guild.fetchInvites().then((data) => {
        data.forEach((Invite, key, map) => {
            var Inv = Invite.code;
            dat[Inv] = Invite.uses;
        })
    })
    console.log(`Ready!`)
})
client.on("guildMemberAdd", (member) => {

    let channel = member.guild.channels.find('name', 'welcome');
    if (!channel) {
        console.log("!channel fails");
        return;
    }
    if (member.user.id == client.user.id) {
        return;
    }
    var guild;
    while (!guild)
        guild = client.guilds.find("name", 'Fucck Off..')
    guild.fetchInvites().then((data) => {
        data.forEach((Invite, key, map) => {
            var Inv = Invite.code;
            if (dat[Inv])
                if (dat[Inv] < Invite.uses) {
                    console.log(`${member.user.username} joined over ${Invite.inviter.username}'s invite ${Invite.url}`)
                    const millis = new Date().getTime() - member.user.createdAt.getTime();
                    const now = new Date();
                    dateFormat(now, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
                    const verificationLevels = ['None', 'Low', 'Medium', 'Insane', 'Extreme'];
                    const days = millis / 1000 / 60 / 60 / 24;
                    let memberavatar = member.user.avatarURL

                    var embed = new Discord.RichEmbed()
                        .setColor('000000')
                        .setAuthor(`${member.user.username}`, `${member.guild.iconURL}`)
                        .setThumbnail(memberavatar)
                        .setDescription(`**عضو جديد !**
**<@!${member.id}>**
**Days In Discord : ${days.toFixed(0)}**
**Invited By : <@!${Invite.inviter.id}>**
**Members invited : ${Invite.uses}**
**Total Members : ${member.guild.memberCount}**
    `)
                        .setFooter(`${member.user.username}`, memberavatar)
                    channel.send(embed)
                }
            dat[Inv] = Invite.uses;
        })
    })
});
//////////////////////////////////////////////////////////////////////////////////////////////////
client.on('message', message => {
    if(!message.channel.guild) return;
    if (message.author.bot) return;
    if(message.content.startsWith(prefix + "ping")) {
    message.delete(3000);
    message.channel.sendMessage(`Ping : ${Date.now() - message.createdTimestamp}.`)
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////
client.on("guildBanAdd", async ban1 => {
  const channel = ban1.channels.find("name", "human-logs")
  if(!channel) return;
  if(channel) {
      ban1.fetchAuditLogs().then(logs => {
      const ser = logs.entries.first().executor;
  var embed = new Discord.RichEmbed()
  .setAuthor(`Human Server`,ban1.iconURL)
  .setDescription(`**  <@${ban1.id}>  تم تبنيد
 <@${ser.id}> من قبل** `)
  .setColor(`RANDOM`)
  .setTimestamp(); 
  channel.sendEmbed(embed)
      })
  }
  });
client.on("guildBanRemove", async ban1 => {
  const channel = ban1.channels.find("name", "human-logs")
  if(!channel) return;
  if(channel) {
      ban1.fetchAuditLogs().then(logs => {
      const ser = logs.entries.first().executor;
  var embed = new Discord.RichEmbed()
  .setAuthor(`Human Server`,ban1.iconURL)
  .setDescription(`**  <@${ban1.id}> ازالة الباند عن
 <@${ser.id}> من قبل** `)
  .setColor(`RANDOM`)
  .setTimestamp(); 
  channel.sendEmbed(embed)
      })
  }
  });
client.on("guildMemberUpdate", async (oldMember ,newMember) => {
  const channel = newMember.guild.channels.find("name", "human-logs")
  if(channel) {

     newMember.guild.fetchAuditLogs().then(logs => {
      const user = logs.entries.first().executor;
  var embed = new Discord.RichEmbed()
  .setAuthor(`${newMember.guild.name}`,newMember.guild.iconURL)
  .setDescription(`**\`${newMember.role.name}\` تمت اضافة رتبة \n  <@${newMember.user.id}> للعضو
<@${user.id}>  من قبل **`)
  .setColor(`RANDOM`)
  .setTimestamp(); 
  channel.sendEmbed(embed)
      })
  }
  });
client.on("guildUpdate",async (oldGuild, newGuild) => {
        if (oldGuild.name !== newGuild.name) {
  const channel = newGuild.channels.find('name', 'human-logs');
  if(channel) {
      newGuild.fetchAuditLogs().then(logs => {
      const user = logs.entries.first().executor;
  var embed = new Discord.RichEmbed()
  .setAuthor(`${newGuild.name}`,newGuild.iconURL)
 .setDescription(`**تم تعديل اعدادات السيرفر
الاسم قبل التعديل :
\`\`\`${oldGuild.name}\`\`\`
الاسم بعد التعديل 
\`\`\`${newGuild.name}\`\`\`
<@${user.id}>  من قبل **`)
  .setColor(`RANDOM`)
  .setTimestamp(); 
  channel.sendEmbed(embed)
      })
  }
        }
 if (oldGuild.region !== newGuild.region) {
  const channel = newGuild.channels.find('name', 'human-logs');
  if(channel) {
      newGuild.fetchAuditLogs().then(logs => {
      const user = logs.entries.first().executor;
  var embed = new Discord.RichEmbed()
  .setAuthor(`${newGuild.name}`,newGuild.iconURL)
 .setDescription(`**تم تعديل اعدادات السيرفر
المكان قبل التعديل
\`\`\`${oldGuild.region}\`\`\`
المكان بعد التعديل
\`\`\`${newGuild.region}\`\`\`
<@${user.id}>  من قبل **`)
  .setColor(`RANDOM`)
  .setTimestamp(); 
  channel.sendEmbed(embed)
      })
  }
           }
           
  });
client.on("roleUpdate",(newRole ,oldRole) => {
               if (oldRole.name !== newRole.name) {
  const channel = newRole.guild.channels.find("name", "human-logs") //تقدر تغير اسم الشات
  if(channel) {
      newRole.guild.fetchAuditLogs().then(logs => {
      const user = logs.entries.first().executor;
 var embed = new Discord.RichEmbed()
  .setAuthor(`${newRole.name}`)
 .setDescription(`**تم تعديل اسم الرتبة
الاسم قبل التعديل :
\`\`\`${newRole.name}\`\`\`
الاسم بعد التعديل 
\`\`\`${oldRole.name}\`\`\`
<@${user.id}>  من قبل **`)
  .setColor(`RANDOM`)
  .setTimestamp(); 
  channel.sendEmbed(embed)
      })
  }
               }
                              if (oldRole.hexColor !== newRole.hexColor ) {
  const channel = newRole.guild.channels.find("name", "human-logs") //تقدر تغير اسم الشات
  if(channel) {
      newRole.guild.fetchAuditLogs().then(logs => {
      const user = logs.entries.first().executor;
 var embed = new Discord.RichEmbed()
  .setAuthor(`${newRole.hexColor}`)
 .setDescription(`* تم تعديل لون الرتبة ${oldRole.name}
 اللون قبل التعديل :
\`\`\`${newRole.hexColor}\`\`\`
اللون بعد التعديل :
\`\`\`${oldRole.hexColor}\`\`\`

<@${user.id}>  من قبل **`)
  .setColor(`RANDOM`)
  .setTimestamp(); 
  channel.sendEmbed(embed)
      })
  }
}
  });
client.on("roleCreate", async rc => {
  const channel = rc.guild.channels.find("name", "human-logs") //تقدر تغير اسم الشات
  if(channel) {
      rc.guild.fetchAuditLogs().then(logs => {
      const user = logs.entries.first().executor;
  var embed = new Discord.RichEmbed()
  .setAuthor(`${rc.guild.name}`,rc.guild.iconURL)
  .setDescription(`**\`${rc.name}\` رتبة تم انشائها
<@${user.id}>  من قبل **`)
  .setColor(`RANDOM`)
  .setTimestamp(); 
  channel.sendEmbed(embed)
      })
  }
  });
client.on("roleDelete", async role1 => {
  const channel = role1.guild.channels.find("name", "human-logs")
  if(!channel) return;
  if(channel) {
      role1.guild.fetchAuditLogs().then(logs => {
      const user = logs.entries.first().executor;
  var embed = new Discord.RichEmbed()
  .setAuthor(`${role1.guild.name}`,role1.guild.iconURL)
  .setTitle(role1.guild.name)
  .setDescription(`**  \`${role1.name}\`  رتبة تم مسحها  :wastebasket:
 <@${user.id}> من قبل** `)
  .setColor(`RANDOM`)
  .setTimestamp(); 
  channel.sendEmbed(embed)
      })
  }
  });
client.on("channelCreate", async cc => {
  const channel = cc.guild.channels.find("name", "human-logs")
  if(channel) {
      cc.guild.fetchAuditLogs().then(logs => {
      const user = logs.entries.first().executor;
  var embed = new Discord.RichEmbed()
  .setAuthor(`${cc.guild.name}`,cc.guild.iconURL)
  .setDescription(`**\`${cc.name}\` قناه تم انشائها
 <@${user.id}> من قبل**`)
  .setColor(`RANDOM`)
  .setTimestamp(); 
  channel.sendEmbed(embed)
      })
  }
  });
client.on('channelUpdate', async (oldCh, newCh) => {
       if (oldCh.name !== newCh.name) {
  const channel = newCh.guild.channels.find("name", "human-logs")
  if(channel) {
      newCh.guild.fetchAuditLogs().then(logs => {
      const user = logs.entries.first().executor;
 var embed = new Discord.RichEmbed()
 .setDescription(`** تم تعديل اعدادات روم ${oldCh.name}
الاسم قبل التعديل :
\`\`\`${oldCh.name}\`\`\`
الاسم بعد التعديل :
\`\`\`${newCh.name}\`\`\`

<@!${user.id}>  من قبل **`)
  .setColor(`RANDOM`)
  .setTimestamp(); 
  channel.sendEmbed(embed)
      })
  }
  
  }
  
  });
client.on("channelDelete", async dele => {
  const channel = dele.guild.channels.find("name", "human-logs")
  if(channel) {
       dele.guild.fetchAuditLogs().then(logs => {
      const user = logs.entries.first().executor;
  var embed = new Discord.RichEmbed()
  .setAuthor(`${dele.guild.name}`,dele.guild.iconURL)
  .setDescription(`**\`${dele.name}\` قناه تم مسحها\n<@${user.id}> من قبل **`)
  .setColor(`RANDOM`)
  .setTimestamp(); 
  channel.sendEmbed(embed)
       })
  }
  });
client.on('messageUpdate', async (message, newMessage) => {
    if (message.content === newMessage.content) return;
    if (!message || !message.id || !message.content || !message.guild || message.author.bot) return;
    const channel = message.guild.channels.find('name', 'human-logs');
    if (!channel) return;

    let embed = new Discord.RichEmbed()
       
       .setAuthor(`${message.author.tag}`, message.author.avatarURL)
       .setColor('RANDOM')
       .setDescription(`✏ **<#${message.channel.id}> في شات <@${message.author.id}> تعديل رسالة ارسلها**\n\nقبل التعديل \n \`${message.cleanContent}\`\n\nبعد التعديل \n \`${newMessage.cleanContent}\``)
       .setTimestamp();
     channel.send({embed:embed});


});
client.on('messageDelete', async message => {
    if (!message || !message.id || !message.content || !message.guild || message.author.bot) return;
    const channel = message.guild.channels.find('name', 'human-logs');
    if (!channel) return;
    
    let embed = new Discord.RichEmbed()
       
       .setAuthor(`${message.author.tag}`, message.author.avatarURL)
       .setColor('BLACK')
       .setDescription(`🗑️ **<#${message.channel.id}> في شات <@${message.author.id}>  حذف رسالة ارسلها \n\nقبل الحذف\n \`${message.cleanContent}\`**`)
       .setTimestamp();
     channel.send({embed:embed});

});
client.on('guildMemberAdd', async member => {
    if (!member || !member.id || !member.guild) return;
    const guild = member.guild;
	
    const channel = member.guild.channels.find('name', 'human-logs');
    if (!channel) return;
    let memberavatar = member.user.avatarURL
    const fromNow = moment(member.user.createdTimestamp).fromNow();
    const isNew = (new Date() - member.user.createdTimestamp) < 900000 ? '🆕' : '';
    
    let embed = new Discord.RichEmbed()
       
       .setAuthor(`${member.user.tag}`, member.user.avatarURL)
	   .setThumbnail(memberavatar)
       .setColor('BLUE')
       .setDescription(`** <@${member.user.id}> عضو دخل الي السيرفر**\n\n`)
       .setTimestamp();
     channel.send({embed:embed});
});
client.on('guildMemberRemove', async member => {
    if (!member || !member.id || !member.guild) return;
    const guild = member.guild;
	
    const channel = member.guild.channels.find('name', 'human-logs');
    if (!channel) return;
    let memberavatar = member.user.avatarURL
    const fromNow = moment(member.joinedTimestamp).fromNow();
    
    let embed = new Discord.RichEmbed()
    
       .setAuthor(`${member.user.tag}`, member.user.avatarURL)
	   .setThumbnail(memberavatar)
       .setColor('RED')
       .setDescription(`** <@${member.user.id}> عضو خرج من السيرفر**\n\n`)
       .setTimestamp();
     channel.send({embed:embed});
});
client.on("emojiCreate", async  rd => {
const channel = rd.guild.channels.find("name", "human-logs")
if (!channel) return;
if(channel) {
    rd.guild.fetchAuditLogs().then(logs => {
      const user = logs.entries.first().executor;
  var embed = new Discord.RichEmbed()
  .setTitle("+ Emoji")
  .setDescription(`**ايموجي تم انشائه \n الاسم : ``${rd.name}``
 ${user.id} من قبل**`)
  .setColor(`RANDOM`)
  .setTimestamp()
  channel.sendEmbed(embed);
    })
}
});
client.on("emojiDelete", async rd => {

const channel = rd.guild.channels.find("name", "human-logs")
if (!channel) return;
if(channel) {
    rd.guild.fetchAuditLogs().then(logs => {
      const user = logs.entries.first().executor;
  var embed = new Discord.RichEmbed()
  .setTitle("- Emoji")
  .setDescription(`**ايموجي تم حذفه \n الاسم : ``${rd.name} ``
 <@${user.id}> من قبل**`)
  .setColor(`RANDOM`)
  .setTimestamp()
    })
  }
});
client.on('voiceStateUpdate', async (oldM, newM) => {
  let m1 = oldM.serverMute;
  let m2 = newM.serverMute;

  let d1 = oldM.serverDeaf;
  let d2 = newM.serverDeaf;

  let ch = oldM.guild.channels.find('name', 'human-logs')
  if(!ch) return;

    oldM.guild.fetchAuditLogs()
    .then(logs => {

      let user = logs.entries.first().executor

    if(m1 === false && m2 === true) {
       let embed = new Discord.RichEmbed()
       .setAuthor(`${user.tag}`,user.avatarURL)

       .setDescription(`**${newM} تم وضع الميوت ل 
       <@${user.id}> : من قبل :id:**`)
       .setTimestamp()
       ch.send(embed)
    }
    if(m1 === true && m2 === false) {
       let embed = new Discord.RichEmbed()
       .setAuthor(`${user.tag}`,user.avatarURL)

       .setDescription(`**${newM} تم فك الميوت علي
       <@${user.id}> : من قبل :id:**`)

       .setTimestamp()

       ch.send(embed)
    }
    if(d1 === false && d2 === true) {
       let embed = new Discord.RichEmbed()
       .setAuthor(`${user.tag}`,user.avatarURL)
       .setDescription(`**${newM} تم وضع الصمت ل
       <@${user.id}> : من قبل :id:**`)


       .setTimestamp()

       ch.send(embed)
    }
    if(d1 === true && d2 === false) {
       let embed = new Discord.RichEmbed()
       .setAuthor(`${user.tag}`,user.avatarURL)
       .setDescription(`**${newM} تمت ازالة الصمت عن
        <@${user.id}> : من قبل :id:**`)
       .setTimestamp()

       ch.send(embed)
    }
  })
})
//////////////////////////////////////////////////////////////////////////////////////////////////
//Games
client.on("message", message => {
    let prechannel = ['511306000725442602']
    if (!prechannel.includes(message.channel.id)) return
    if (!message.channel.guild) return;

    if (message.content.startsWith(prefix + '3wasm')) {

        const type = require('./3wasm.json');
        const item = type[Math.floor(Math.random() * type.length)];
        const filter = response => {
            return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
        };
        message.channel.send('**لديك 15 ثانية لتجيب**').then(msg => {

            const embed = new Discord.RichEmbed()
                .setColor("RANDOM")
                .setAuthor(`${message.author.tag}`, message.author.avatarURL)
                .setThumbnail(message.author.avatarURL)
                .addField(`**Human **`, ` **${item.type}**`)
                .setFooter(`ستكسب 20 نقطة`)

            msg.channel.send(embed).then(() => {
                message.channel.awaitMessages(filter, {
                        maxMatches: 1,
                        time: 15000,
                        errors: ['time']
                    })
                    .then((collected) => {
                        message.channel.send(`**${collected.first().author} مبروك لقد كسبت 20 نقطة
    لمعرفة نقاطك الرجاء كتابة !points**`);
                        console.log(`[Typing] ${collected.first().author} typed the word.`);
                        let userData = points[collected.first().author.id];
                        userData.wins += 1
                        userData.points += 20;

                    })

                    .catch(collected => {
                        points[message.author.id].loses += 1;

                        message.channel.send(`:x: **حظ اوفر المرة القادمة ! لقد خسرت , انتهى الوقت**`);
                        console.log('[Typing] Error: No one type the word.');
                    })
            })
        })
        points[message.author.id].game += 1;


    }
    fs.writeFile("./points.json", JSON.stringify(points), function(err) {
        if (err) console.log(err);
    })

    if (!points[message.author.id]) points[message.author.id] = {
        points: 0,
        wins: 0,
        loses: 0,
        game: 0,

    };
    if (message.author.bot) return;

    if (!message.channel.guild) return;
    let userData = points[message.author.id];

    if (message.content.startsWith(prefix + 'points')) {
        let pointss = userData.points
        try {
            pointss = shortNumber(pointss);
        } catch (error) {
            pointss = 0;
        }
        let wins = userData.wins
        try {
            wins = shortNumber(wins);
        } catch (error) {
            wins = 0;
        }
        let loses = userData.loses
        try {
            loses = shortNumber(loses);
        } catch (error) {
            loses = 0;
        }
        let games = userData.game
        try {
            games = shortNumber(games);
        } catch (error) {
            games = 0;
        }
        let embed = new Discord.RichEmbed()
            .setAuthor(`${message.author.tag}`, message.author.avatarURL)
            .setColor('#000000')
            .setDescription(`**Human
    
    :white_check_mark: Wins : ${wins}
    :x: Loses: ${loses}
    :label: Points: ${pointss}
    :video_game: Games Played: ${games}**`);
        message.channel.sendEmbed(embed)
    }
    fs.writeFile("./points.json", JSON.stringify(points), (err) => {
        if (err) console.error(err)
    })
    if (message.author.bot) return;

    if (!message.channel.guild) return;

    if (!points[message.author.id]) points[message.author.id] = {
        points: 0,
        wins: 0,
        loses: 0,
        game: 0,
    };
    if (message.content.startsWith(prefix + 'fkk')) {

        const type = require('./fkk.json');
        const item = type[Math.floor(Math.random() * type.length)];
        const filter = response => {
            return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
        };
        message.channel.send('**لديك 10  ثواني لتجيب**').then(msg => {

            const embed = new Discord.RichEmbed()
                .setColor("RANDOM")
                .setAuthor(`${message.author.tag}`, message.author.avatarURL)
                .setThumbnail(message.author.avatarURL)
                .addField(`**Human**`, ` **${item.type}**`)
                .setFooter(`ستكسب 10 نقاط `)

            msg.channel.send(embed).then(() => {
                message.channel.awaitMessages(filter, {
                        maxMatches: 1,
                        time: 10000,
                        errors: ['time']
                    })
                    .then((collected) => {
                        message.channel.send(`**${collected.first().author} مبروك لقد كسبت 10 نقاط
    لمعرفة نقاطك الرجاء كتابة !points**`);

                        console.log(`[Typing] ${collected.first().author} typed the word.`);
                        let userData = points[collected.first().author.id];
                        userData.wins += 1
                        userData.points += 10;

                    })

                    .catch(collected => {
                        points[message.author.id].loses += 1;

                        message.channel.send(`:x: **حظ اوفر المرة القادمة ! لقد خسرت , انتهى الوقت**`);
                        console.log('[Typing] Error: No one type the word.');

                    })
            })
        })
        points[message.author.id].game += 1;


    }
    fs.writeFile("./points.json", JSON.stringify(points), function(err) {
        if (err) console.log(err);
    })
    if (message.author.bot) return;

    if (!message.channel.guild) return;

    if (!points[message.author.id]) points[message.author.id] = {
        points: 0,
        wins: 0,
        loses: 0,
        game: 0,

    };
    if (message.content.startsWith(prefix + 'a7sb')) {

        const type = require('./a7sb.json');
        const item = type[Math.floor(Math.random() * type.length)];
        const filter = response => {
            return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
        };
        message.channel.send('**لديك 15 ثانية لتجيب**').then(msg => {

            const embed = new Discord.RichEmbed()
                .setColor("RANDOM")
                .setAuthor(`${message.author.tag}`, message.author.avatarURL)
                .setThumbnail(message.author.avatarURL)
                .addField(`**Human**`, ` **${item.type}**`)
                .setFooter(`ستكسب 5 نقاط`)

            msg.channel.send(embed).then(() => {
                message.channel.awaitMessages(filter, {
                        maxMatches: 1,
                        time: 15000,
                        errors: ['time']
                    })
                    .then((collected) => {
                        message.channel.send(`**${collected.first().author} مبروك لقد كسبت 5 نقاط
    لمعرفة نقاطك الرجاء كتابة !points**`);
                        console.log(`[Typing] ${collected.first().author} typed the word.`);
                        let userData = points[collected.first().author.id];
                        userData.wins += 1
                        userData.points += 5;

                    })

                    .catch(collected => {
                        points[message.author.id].loses += 1;

                        message.channel.send(`:x: **حظ اوفر المرة القادمة ! لقد خسرت , انتهى الوقت**`);
                        console.log('[Typing] Error: No one type the word.');
                    })

            })

        })
        points[message.author.id].game += 1;

    }
    fs.writeFile("./points.json", JSON.stringify(points), function(err) {
        if (err) console.log(err);
    })

    if (message.author.bot) return;

    if (!message.channel.guild) return;

    if (!points[message.author.id]) points[message.author.id] = {
        points: 0,
        wins: 0,
        loses: 0,
        game: 0,

    };
    if (message.content.startsWith(prefix + '3lm')) {

        const type = require('./a3lam.json');
        const item = type[Math.floor(Math.random() * type.length)];
        const filter = response => {
            return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
        };
        message.channel.send('**لديك 15 ثانية لتجيب**').then(msg => {

            const embed = new Discord.RichEmbed()
                .setColor("RANDOM")
                .setAuthor(`${message.author.tag}`, message.author.avatarURL)
                .setThumbnail(message.author.avatarURL)
                .addField(`**Human**`, ` **${item.type}**`)
                .setFooter(`ستكسب 15 نقطة`)

            msg.channel.send(embed).then(() => {
                message.channel.awaitMessages(filter, {
                        maxMatches: 1,
                        time: 15000,
                        errors: ['time']
                    })
                    .then((collected) => {
                        message.channel.send(`**${collected.first().author} مبروك لقد كسبت 15 نقطة 
    لمعرفة نقاطك الرجاء كتابة !points**`);
                        console.log(`[Typing] ${collected.first().author} typed the word.`);
                        let userData = points[collected.first().author.id];
                        userData.wins += 1
                        userData.points += 15;

                    })

                    .catch(collected => {
                        points[message.author.id].loses += 1;

                        message.channel.send(`:x: **حظ اوفر المرة القادمة ! لقد خسرت , انتهى الوقت**`);
                        console.log('[Typing] Error: No one type the word.');
                    })
            })

        })
        points[message.author.id].game += 1;

    }
    fs.writeFile("./points.json", JSON.stringify(points), function(err) {
        if (err) console.log(err);
    })

    if (message.author.bot) return;


    if (!message.channel.guild) return;

    if (message.content.startsWith(prefix + 'helps')) {


        const embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setAuthor(`${message.author.tag}`, message.author.avatarURL)
            .setThumbnail(message.author.avatarURL)
            .setDescription(`
    **
    
    Prefix = '!',
    اوامر الالعاب,
    
    اول واحد يجاوب ياخذ النقاط,
    
    ${prefix}fkk - لتفكيك الكلمات -  10 نقاط,
    ${prefix}a7sb - عمليات حسابية - 5 نقاط,
    ${prefix}3lm - ما اسم الدولة - 15 نقطة ,
    ${prefix}3wasm  - ما عاصمة الدولة  - 20 نقطة,
    ${prefix}points - لمعرفة نقاطك;
    -
    اوامر عامة ,
    ${prefix}ping - لمعرفة بنج البوت,
    
    **
    `)
        message.channel.send(embed)

    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////
client1.login(process.env.BOT_TOKEN);
