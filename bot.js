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
var report = JSON.parse(fs.readFileSync(`./Database/report.json`, `utf8`));
let prefixes = JSON.parse(fs.readFileSync("./Database/prefix.json", "utf8"));
var r = JSON.parse(fs.readFileSync('./Database/rchannel.json'));
var uc = JSON.parse(fs.readFileSync('./Database/uchannel.json'));
let logs = JSON.parse(fs.readFileSync('./Database/modlogs.json'));
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
// Message Logs
client.on('messageDelete', message => {
	if (!message.channel.guild) return;
	if (message.author.bot) return;
    if (!logs[message.guild.id]) logs[message.guild.id] = {
        channel: 'logs',
        onoff: 'Off',
    };
    let name = logs[message.guild.id].channel;
    if(logs[message.guild.id].onoff === 'Off') return;
    const logChannel = message.guild.channels.find("name", name);
	if (logs[message.guild.id].onoff)
	if(message.author.bot) return;
	if(message.channel.type === 'dm') return;
	if(!message.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
	if(!message.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) return;

	if(!logChannel) return;

	let messageDelete = new Discord.RichEmbed()
	.setAuthor(message.guild.name)
	.setColor('RED')
	.setThumbnail(message.author.avatarURL)
	.setDescription(`:wastebasket: Successfully \`\`DELETE\`\` **MESSAGE** In ${message.channel}\n\n**Channel:** \`\`${message.channel.name}\`\`\n**Sent By:** <@${message.author.id}>\n**Message:**\n\`\`\`${message}\`\`\``)
	.setTimestamp()
	.setFooter(message.guild.name, message.guild.iconURL);

	logChannel.send(messageDelete);
	    fs.writeFile("./Database/modlogs.json", JSON.stringify(logs), (err) => {
        if (err) console.error(err);
    });
});
client.on('messageUpdate', (oldMessage, newMessage) => {
	if (!oldMessage.channel.guild) return;
	if (oldMessage.author.bot) return;
    if (!logs[oldMessage.guild.id]) logs[oldMessage] = {
        channel: 'logs',
        onoff: 'Off',
    };
    let name = logs[oldMessage.guild.id].channel;
    if(logs[oldMessage.guild.id].onoff === 'Off') return;
    const logChannel = oldMessage.guild.channels.find("name", name);
    
	if(oldMessage.author.bot) return;
	if(!oldMessage.channel.type === 'dm') return;
	if(!oldMessage.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
	if(!oldMessage.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) return;

	if(!logChannel) return;

	if(oldMessage.content.startsWith('https://')) return;

	let messageUpdate = new Discord.RichEmbed()
	.setAuthor(oldMessage.guild.name)
	.setThumbnail(oldMessage.author.avatarURL)
	.setColor('BLUE')
	.setDescription(`:wrench: Successfully \`\`EDIT\`\` **MESSAGE** In ${oldMessage.channel}\n\n**Channel:** \`\`${oldMessage.channel.name}\`\`\n\n**Sent By:** <@${oldMessage.author.id}>\n\n**Old Message:**\`\`\`${oldMessage}\`\`\`\n**New Message:**\`\`\`${newMessage}\`\`\``)
	.setTimestamp()
	.setFooter(oldMessage.guild.name, oldMessage.guild.iconURL);

	logChannel.send(messageUpdate);
		    fs.writeFile("./Database/modlogs.json", JSON.stringify(logs), (err) => {
        if (err) console.error(err);
    });
});
// Roles Logs
client.on('roleCreate', role => {


    if (!logs[role.guild.id]) logs[role.guild.id] = {
        channel: 'logs',
        onoff: 'Off',
    };
    let name = logs[role.guild.id].channel;
    if(logs[role.guild.id].onoff === 'Off') return;
    const logChannel = role.guild.channels.find("name", name);
    
	if(!role.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
	if(!role.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;

	if(!logChannel) return;

	role.guild.fetchAuditLogs().then(logs => {
		var userID = logs.entries.first().executor.id;
		var userAvatar = logs.entries.first().executor.avatarURL;

		let roleCreate = new Discord.RichEmbed()
		.setAuthor(role.guild.name)
		.setThumbnail(userAvatar)
		.setDescription(`:white_check_mark: Successfully \`\`CREATE\`\` Role.\n\n**Role Name:** \`\`${role.name}\`\`\n**By:** <@${userID}>`)
		.setColor('GREEN')
		.setTimestamp()
		.setFooter(role.guild.name, role.guild.iconURL);

		logChannel.send(roleCreate);
			    fs.writeFile("./Database/modlogs.json", JSON.stringify(logs), (err) => {
        if (err) console.error(err);
    });
	});
});
client.on('roleDelete', role => {


    if (!logs[role.guild.id]) logs[role.guild.id] = {
        channel: 'logs',
        onoff: 'Off',
    };
    let name = logs[role.guild.id].channel;
    if(logs[role.guild.id].onoff === 'Off') return;
    const logChannel = role.guild.channels.find("name", name);
	if(!role.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
	if(!role.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;

	if(!logChannel) return;

	role.guild.fetchAuditLogs().then(logs => {
		var userID = logs.entries.first().executor.id;
		var userAvatar = logs.entries.first().executor.avatarURL;

		let roleDelete = new Discord.RichEmbed()
		.setAuthor(role.guild.name)
		.setThumbnail(userAvatar)
		.setDescription(`:white_check_mark: Successfully \`\`DELETE\`\` Role.\n\n**Role Name:** \`\`${role.name}\`\`\n**By:** <@${userID}>`)
		.setColor('RED')
		.setTimestamp()
		.setFooter(role.guild.name, role.guild.iconURL);

		logChannel.send(roleDelete);
			    fs.writeFile("./Database/modlogs.json", JSON.stringify(logs), (err) => {
        if (err) console.error(err);
    });
	});
});
client.on('roleUpdate', (oldRole, newRole) => {

    if (!logs[oldRole.guild.id]) logs[oldRole.guild.id] = {
        channel: 'logs',
        onoff: 'Off',
    };
    let name = logs[oldRole.guild.id].channel;
    if(logs[oldRole.guild.id].onoff === 'Off') return;
    const logChannel = oldRole.guild.channels.find("name", name);
    
	if(!oldRole.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
	if(!oldRole.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;

	if(!logChannel) return;

	oldRole.guild.fetchAuditLogs().then(logs => {
		var userID = logs.entries.first().executor.id;
		var userAvatar = logs.entries.first().executor.avatarURL;

		if(oldRole.name !== newRole.name) {
			let roleUpdateName = new Discord.RichEmbed()
		    .setAuthor(newRole.guild.name)
			.setThumbnail(userAvatar)
			.setColor('RANDOM')
			.setDescription(`**\n**:white_check_mark: Successfully \`\`EDITED\`\` Role Name.\n\n**Old Name:** \`\`${oldRole.name}\`\`\n**New Name:** \`\`${newRole.name}\`\`\n\n**By:** <@${userID}>`)
			.setTimestamp()
			.setFooter(oldRole.guild.name, oldRole.guild.iconURL);

			logChannel.send(roleUpdateName);
		}
		if(oldRole.hexColor !== newRole.hexColor) {
			if(oldRole.hexColor === '#000000') {
				var oldColor = '`Default`';
			}else {
				var oldColor = oldRole.hexColor;
			}
			if(newRole.hexColor === '#000000') {
				var newColor = '`Default`';
			}else {
				var newColor = newRole.hexColor;
			}
			let roleUpdateColor = new Discord.RichEmbed()
			.setAuthor(oldRole.guild.name)
			.setThumbnail(userAvatar)
			.setColor('RANDOM')
			.setDescription(`:white_check_mark: Successfully \`\`EDITED\`\` **${oldRole.name}** Role Color.\n\n**Old Color:** ${oldColor}\n**New Color:** ${newColor}\n\n**By:** <@${userID}>`)
			.setTimestamp()
			.setFooter(oldRole.guild.name, oldRole.guild.iconURL);

			logChannel.send(roleUpdateColor);
						    fs.writeFile("./Database/modlogs.json", JSON.stringify(logs), (err) => {
        if (err) console.error(err);
    });
		}
	});
});
// Channels Log
client.on('channelDelete', channel => {
	if (!channel.guild) return;

    if (!logs[channel.guild.id]) logs[channel.guild.id] = {
        channel: 'logs',
        onoff: 'Off',
    };
    let name = logs[channel.guild.id].channel;
    if(logs[channel.guild.id].onoff === 'Off') return;
    const logChannel = channel.guild.channels.find("name", name);
	if(!channel.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
	if(!channel.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;

	if(!logChannel) return;

	if(channel.type === 'text') {
		var roomType = 'Text';
	}else
	if(channel.type === 'voice') {
		var roomType = 'Voice';
	}else
	if(channel.type === 'category') {
		var roomType = 'Category';
	}

	channel.guild.fetchAuditLogs().then(logs => {
		var userID = logs.entries.first().executor.id;
		var userAvatar = logs.entries.first().executor.avatarURL;

		let channelDelete = new Discord.RichEmbed()
		.setAuthor(channel.guild.name)
		.setThumbnail(userAvatar)
		.setDescription(`:white_check_mark: Successfully \`\`DELETE\`\` **${roomType}** channel.\n\n**Channel Name:** \`\`${channel.name}\`\`\n**By:** <@${userID}>`)
		.setColor('RED')
		.setTimestamp()
		.setFooter(channel.guild.name, channel.guild.iconURL);

		logChannel.send(channelDelete);
					    fs.writeFile("./Database/modlogs.json", JSON.stringify(logs), (err) => {
        if (err) console.error(err);
    });
	});
});
client.on('channelCreate', channel => {
	if (!channel.guild) return;

	    if (!logs[channel.guild.id]) logs[channel.guild.id] = {
        channel: 'logs',
        onoff: 'Off',
    };
    let name = logs[channel.guild.id].channel;
    if(logs[channel.guild.id].onoff === 'Off') return;
    const logChannel = channel.guild.channels.find("name", name);
	if(!channel.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
	if(!channel.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;

	if(!logChannel) return;

	if(channel.type === 'text') {
		var roomType = 'Text';
	}else
	if(channel.type === 'voice') {
		var roomType = 'Voice';
	}else
	if(channel.type === 'category') {
		var roomType = 'Category';
	}

	channel.guild.fetchAuditLogs().then(logs => {
		var userID = logs.entries.first().executor.id;
		var userAvatar = logs.entries.first().executor.avatarURL;

		let channelCreate = new Discord.RichEmbed()
		.setAuthor(channel.guild.name)
		.setThumbnail(userAvatar)
		.setDescription(`:white_check_mark: Successfully \`\`CREATED\`\` **${roomType}** channel.\n\n**Channel Name:** \`\`${channel.name}\`\`\n**By:** <@${userID}>`)
		.setColor('RED')
		.setTimestamp()
		.setFooter(channel.guild.name, channel.guild.iconURL);

		logChannel.send(channelCreate);
					    fs.writeFile("./Database/modlogs.json", JSON.stringify(logs), (err) => {
        if (err) console.error(err);
    });
	})
});
client.on('channelUpdate', (oldChannel, newChannel) => {
	if (!oldChannel.channel.guild) return;
	if (oldChannel.author.bot) return;

		    if (!logs[oldChannel.guild.id]) logs[oldChannel.guild.id] = {
        channel: 'logs',
        onoff: 'Off',
    };
    let name = logs[oldChannel.guild.id].channel;
    if(logs[oldChannel.guild.id].onoff === 'Off') return;
    const logChannel = oldChannel.guild.channels.find("name", name);
	if(!oldChannel.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
	if(!oldChannel.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;

	if(!logChannel) return;

	if(oldChannel.type === 'text') {
		var channelType = 'Text';
	}else
	if(oldChannel.type === 'voice') {
		var channelType = 'Voice';
	}else
	if(oldChannel.type === 'category') {
		var channelType = 'Category';
	}

	oldChannel.guild.fetchAuditLogs().then(logs => {
		var userID = logs.entries.first().executor.id;
		var userAvatar = logs.entries.first().executor.avatarURL;

		if(oldChannel.name !== newChannel.name) {
			let newName = new Discord.RichEmbed()
			.setAuthor(oldChannel.guild.name)
			.setThumbnail(userAvatar)
			.setColor('RANDOM')
			.setDescription(`:wrench: Successfully Edited **${channelType}** Channel Name\n\n**Old Name:** \`\`${oldChannel.name}\`\`\n**New Name:** \`\`${newChannel.name}\`\`\n\n**By:** <@${userID}>`)
			.setTimestamp()
			.setFooter(oldChannel.guild.name, oldChannel.guild.iconURL)

			logChannel.send(newName);
		}
		if(oldChannel.topic !== newChannel.topic) {
			let newTopic = new Discord.RichEmbed()
			.setAuthor(oldChannel.guild.name)
			.setThumbnail(userAvatar)
			.setColor('RANDOM')
			.setDescription(`:wrench: Successfully Edited **${channelType}** Channel Topic\n\n**Old Topic:**\n\`\`\`${oldChannel.topic || 'NULL'}\`\`\`\n**New Topic:**\n\`\`\`${newChannel.topic || 'NULL'}\`\`\`\n**Channel:** ${oldChannel}\n**By:** <@${userID}>`)
			.setTimestamp()
			.setFooter(oldChannel.guild.name, oldChannel.guild.iconURL)

			logChannel.send(newTopic);
						    fs.writeFile("./Database/modlogs.json", JSON.stringify(logs), (err) => {
        if (err) console.error(err);
    });
		}
	})
});
// Guild Logs
client.on('guildBanAdd', (guild, user) => {
	if (!guild.channel.guild) return;
	if (guild.author.bot) return;

			    if (!logs[guild.id]) logs[guild.id] = {
        channel: 'logs',
        onoff: 'Off',
    };
    let name = logs[guild.id].channel;
    if(logs[guild.id].onoff === 'Off') return;
    const logChannel = guild.channels.find("name", name);
	if(!guild.member(client.user).hasPermission('EMBED_LINKS')) return;
	if(!guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;

	if(!logChannel) return;

	guild.fetchAuditLogs().then(logs => {
		var userID = logs.entries.first().executor.id;
		var userAvatar = logs.entries.first().executor.avatarURL;
		
		if(userID === client.user.id) return;

		let banInfo = new Discord.RichEmbed()
		.setAuthor(guild.name)
		.setThumbnail(userAvatar)
		.setColor('DARK_RED')
		.setDescription(`:airplane: Successfully \`\`BANNED\`\` **${user.username}** From the server!\n\n**User:** <@${user.id}>\n**By:** <@${userID}>`)
		.setTimestamp()
		.setFooter(guild.name, guild.iconURL)

		logChannel.send(banInfo);
					    fs.writeFile("./Database/modlogs.json", JSON.stringify(logs), (err) => {
        if (err) console.error(err);
    });
	})
});
client.on('guildBanRemove', (guild, user) => {
	if (!guild.channel.guild) return;
	if (guild.author.bot) return;

			    if (!logs[guild.id]) logs[guild.id] = {
        channel: 'logs',
        onoff: 'Off',
    };
    let name = logs[guild.id].channel;
    if(logs[guild.id].onoff === 'Off') return;
    const logChannel = guild.channels.find("name", name);
	if(!guild.member(client.user).hasPermission('EMBED_LINKS')) return;
	if(!guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;

	if(!logChannel) return;

	guild.fetchAuditLogs().then(logs => {
		var userID = logs.entries.first().executor.id;
		var userAvatar = logs.entries.first().executor.avatarURL;
		
		if(userID === client.user.id) return;

		let unBanInfo = new Discord.RichEmbed()
		.setAuthor(guild.name)
		.setThumbnail(userAvatar)
		.setColor('GREEN')
		.setDescription(`:unlock: Successfully \`\`UNBANNED\`\` **${user.username}** From the server\n\n**User:** <@${user.id}>\n**By:** <@${userID}>`)
		.setTimestamp()
		.setFooter(guild.name, guild.iconURL);

		logChannel.send(unBanInfo);
					    fs.writeFile("./Database/modlogs.json", JSON.stringify(logs), (err) => {
        if (err) console.error(err);
    });
	});
});
client.on('guildUpdate', (oldGuild, newGuild) => {
	if (!oldGuild.channel.guild) return;
	if (oldGuild.author.bot) return;

			    if (!logs[oldGuild.guild.id]) logs[oldGuild.guild.id] = {
        channel: 'logs',
        onoff: 'Off',
    };
    let name = logs[oldGuild.guild.id].channel;
    if(logs[oldGuild.guild.id].onoff === 'Off') return;
    const logChannel = oldGuild.guild.channels.find("name", name);
	if(!oldGuild.member(client.user).hasPermission('EMBED_LINKS')) return;
	if(!oldGuild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;

	if(!logChannel) return;

	oldGuild.fetchAuditLogs().then(logs => {
		var userID = logs.entries.first().executor.id;
		var userAvatar = logs.entries.first().executor.avatarURL;

		if(oldGuild.name !== newGuild.name) {
			let guildName = new Discord.RichEmbed()
			.setAuthor(newGuild.name)
			.setThumbnail(userAvatar)
			.setColor('RANDOM')
			.setDescription(`:white_check_mark: Successfully \`\`EDITED\`\` The guild name.\n\n**Old Name:** \`\`${oldGuild.name}\`\`\n**New Name:** \`\`${newGuild.name}\`\`\n**By:** <@${userID}>`)
			.setTimestamp()
			.setFooter(newGuild.name, oldGuild.iconURL)

			logChannel.send(guildName)
		}
		if(oldGuild.region !== newGuild.region) {
			let guildRegion = new Discord.RichEmbed()
			.setAuthor(newGuild.name)
			.setThumbnail(userAvatar)
			.setColor('RANDOM')
			.setDescription(`:white_check_mark: Successfully \`\`EDITED\`\` The guild region.\n\n**Old Region:** ${oldGuild.region}\n**New Region:** ${newGuild.region}\n**By:** <@${userID}>`)
			.setTimestamp()
			.setFooter(oldGuild.name, oldGuild.iconURL)

			logChannel.send(guildRegion);
		}
		if(oldGuild.verificationLevel !== newGuild.verificationLevel) {
			if(oldGuild.verificationLevel === 0) {
				var oldVerLvl = 'Very Easy';
			}else
			if(oldGuild.verificationLevel === 1) {
				var oldVerLvl = 'Easy';
			}else
			if(oldGuild.verificationLevel === 2) {
				var oldVerLvl = 'Medium';
			}else
			if(oldGuild.verificationLevel === 3) {
				var oldVerLvl = 'Hard';
			}else
			if(oldGuild.verificationLevel === 4) {
				var oldVerLvl = 'Very Hard';
			}

			if(newGuild.verificationLevel === 0) {
				var newVerLvl = 'Very Easy';
			}else
			if(newGuild.verificationLevel === 1) {
				var newVerLvl = 'Easy';
			}else
			if(newGuild.verificationLevel === 2) {
				var newVerLvl = 'Medium';
			}else
			if(newGuild.verificationLevel === 3) {
				var newVerLvl = 'Hard';
			}else
			if(newGuild.verificationLevel === 4) {
				var newVerLvl = 'Very Hard';
			}

			let verLog = new Discord.RichEmbed()
			.setAuthor(newGuild.name)
			.setThumbnail(userAvatar)
			.setColor('RANDOM')
			.setDescription(`**\n**:white_check_mark: Successfully \`\`EDITED\`\` Guild Verification level.\n\n**Old Verification Level:** ${oldVerLvl}\n**New Verification Level:** ${newVerLvl}\n**By:** <@${userID}>`)
			.setTimestamp()
			.setFooter(oldGuild.name, oldGuild.iconURL)

			logChannel.send(verLog);
		}
	});
				    fs.writeFile("./Database/modlogs.json", JSON.stringify(logs), (err) => {
        if (err) console.error(err);
    });
});
client.on('guildMemberUpdate', (oldMember, newMember) => {
			    if (!logs[oldMember.guild.id]) logs[oldMember.guild.id] = {
        channel: 'logs',
        onoff: 'Off',
    };
    let name = logs[oldMember.guild.id].channel;
    if(logs[oldMember.guild.id].onoff === 'Off') return;
    const logChannel = oldMember.guild.channels.find("name", name);
	if(!logChannel) return;

	oldMember.guild.fetchAuditLogs().then(logs => {
		var userID = logs.entries.first().executor.id;
		var userAvatar = logs.entries.first().executor.avatarURL;
		var userTag = logs.entries.first().executor.tag;

		if(oldMember.nickname !== newMember.nickname) {
			if(oldMember.nickname === null) {
				var oldNM = '\`\`اسمه الاصلي\`\`';
			}else {
				var oldNM = oldMember.nickname;
			}
			if(newMember.nickname === null) {
				var newNM = '\`\`اسمه الاصلي\`\`';
			}else {
				var newNM = newMember.nickname;
			}

			let updateNickname = new Discord.RichEmbed()
			.setAuthor(oldMember.guild.name)
			.setThumbnail(userAvatar)
			.setColor('RANDOM')
			.setDescription(`:spy: Successfully \`\`CHANGE\`\` Member Nickname.\n\n**User:** ${oldMember}\n**Old Nickname:** ${oldNM}\n**New Nickname:** ${newNM}\n**By:** <@${userID}>)`)
			.setTimestamp()
			.setFooter(oldMember.guild.name, oldMember.guild.iconURL)

			logChannel.send(updateNickname);
		}
		if(oldMember.roles.size < newMember.roles.size) {
			let role = newMember.roles.filter(r => !oldMember.roles.has(r.id)).first();
			let roleAdded = new Discord.RichEmbed()
			.setAuthor(oldMember.guild.name)
			.setThumbnail(oldMember.guild.iconURL)
			.setAuthor(oldMember.guild.name)
			.setColor('RANDOM')
			.setDescription(`:white_check_mark: Successfully \`\`ADDED\`\` Role to \n**${oldMember.user.username}**\n\n**User:** <@${oldMember.id}>\n**Role:** \`\`${role.name}\`\` \n**By:** <@${userID}>`)
			.setTimestamp()
			.setFooter(userTag, userAvatar)
			
			logChannel.send(roleAdded);
		}
		if(oldMember.roles.size > newMember.roles.size) {
			let role = oldMember.roles.filter(r => !newMember.roles.has(r.id)).first();
			
			let roleRemoved = new Discord.RichEmbed()
			.setAuthor(oldMember.guild.name)
			.setThumbnail(oldMember.guild.iconURL)
			.setColor('RANDOM')
			.setDescription(`:negative_squared_cross_mark: Successfully \`\`REMOVED\`\` Role from **${oldMember.user.username}**\n\n**User:** <@${oldMember.user.id}>\n**Role:** \`\`${role.name}\`\`\n**By:** <@${userID}>`)
			.setTimestamp()
			.setFooter(userTag, userAvatar)
			
			logChannel.send(roleRemoved);
		}
	})
	if(oldMember.guild.owner.id !== newMember.guild.owner.id) {
		let newOwner = new Discord.RichEmbed()
		.setThumbnail(oldMember.guild.iconURL)
		.setColor('GREEN')
		.setDescription(`:white_check_mark: Successfully \`\`TRANSFER\`\` The Owner Ship.\n\n**Old Owner:** <@${oldMember.user.id}> (ID: ${oldMember.user.id})\n**New Owner:** <@${newMember.user.id}> (ID: ${newMember.user.id})`)
		.setTimestamp()
		.setFooter(oldMember.guild.name, oldMember.guild.iconURL)
		
		logChannel.send(newOwner);
	}
				    fs.writeFile("./Database/modlogs.json", JSON.stringify(logs), (err) => {
        if (err) console.error(err);
    });
});
// Fake Account Ban. 
/*client.on('guildMemberAdd', member => {
	if(datediff(parseDate(moment(member.user.createdTimestamp).format('l')), parseDate(moment().format('l'))) < 1) {
		//member.guild.member(member).ban({ reason: 'Fake account.' })
		member.guild.channels.find(c => c.id === '511307891114770433').send(`:white_check_mark: | <@${member.id}> Successfully banned. Reason: \`\`Fake account.\`\``);
	}
});
function parseDate(str) {
	var mdy = str.split('/');
	return new Date(mdy[2], mdy[0]-1, mdy[1]);
};
function datediff(first, second) {
	return Math.round((second-first)/(1000*60*60*24));
};*/
// Voice Logs
client.on('voiceStateUpdate', (voiceOld, voiceNew) => {
	if (!voiceOld.channel.guild) return;
	if (voiceOld.author.bot) return;

				    if (!logs[voiceOld.guild.id]) logs[voiceOld.guild.id] = {
        channel: 'logs',
        onoff: 'Off',
    };
    let name = logs[voiceOld.guild.id].channel;
    if(logs[voiceOld.guild.id].onoff === 'Off') return;
    const logChannel = voiceOld.guild.channels.find("name", name);
    
	if(!voiceOld.guild.member(client.user).hasPermission('EMBED_LINKS')) return;
	if(!voiceOld.guild.member(client.user).hasPermission('VIEW_AUDIT_LOG')) return;

	var serverMutedOld = voiceOld.serverMute;
	var serverMutedNew = voiceNew.serverMute;
	var serverDeafOld = voiceOld.serverDeaf;
	var serverDeafNew = voiceNew.serverDeaf;

	if(!logChannel) return;

	voiceOld.guild.fetchAuditLogs().then(logs => {
		var userID = logs.entries.first().executor.id;
		var userTag = logs.entries.first().executor.tag;
		var userAvatar = logs.entries.first().executor.avatarURL;

// Server Muted Voice
		if(serverMutedOld === false && serverMutedNew === true) {
			let serverMutev = new Discord.RichEmbed()
			.setAuthor(voiceOld.guild.name)
			.setTitle('[VOICE MUTE]')
			.setThumbnail('https://images-ext-1.discordapp.net/external/pWQaw076OHwVIFZyeFoLXvweo0T_fDz6U5C9RBlw_fQ/https/cdn.pg.sa/UosmjqDNgS.png')
			.setColor('RANDOM')
			.setDescription(`**User:** ${voiceOld}\n**By:** <@${userID}>\n**Channel:** \`\`${voiceOld.voiceChannel.name}\`\``)
			.setTimestamp()
			.setFooter(userTag, userAvatar)

			logChannel.send(serverMutev);
		}
// Server UnMuted Voice
		if(serverMutedOld === true && serverMutedNew === false) {
			let serverUnmutev = new Discord.RichEmbed()
			.setTitle('[VOICE UNMUTE]')
			.setAuthor(voiceOld.guild.name)
			.setThumbnail('https://images-ext-1.discordapp.net/external/u2JNOTOc1IVJGEb1uCKRdQHXIj5-r8aHa3tSap6SjqM/https/cdn.pg.sa/Iy4t8H4T7n.png')
			.setColor('RANDOM')
			.setDescription(`**User:** ${voiceOld}\n**By:** <@${userID}>\n**Channel:** \`\`${voiceOld.voiceChannel.name}\`\``)
			.setTimestamp()
			.setFooter(userTag, userAvatar)

			logChannel.send(serverUnmutev);
		}
// Server Deafen Voice
		if(serverDeafOld === false && serverDeafNew === true) {
			let serverDeafv = new Discord.RichEmbed()
			.setTitle('[VOICE DEAF]')
			.setAuthor(voiceOld.guild.name)
			.setThumbnail('https://images-ext-1.discordapp.net/external/7ENt2ldbD-3L3wRoDBhKHb9FfImkjFxYR6DbLYRjhjA/https/cdn.pg.sa/auWd5b95AV.png')
			.setColor('RANDOM')
			.setDescription(`**User:** ${voiceOld}\n**By:** <@${userID}>\n**Channel:** \`\`${voiceOld.voiceChannel.name}\`\``)
			.setTimestamp()
			.setFooter(userTag, userAvatar)

			logChannel.send(serverDeafv);
		}
// Server UnDeafen Voice
		if(serverDeafOld === true && serverDeafNew === false) {
			let serverUndeafv = new Discord.RichEmbed()
			.setTitle('[VOICE UNDEAF]')
			.setAuthor(voiceOld.guild.name)
			.setThumbnail('https://images-ext-2.discordapp.net/external/s_abcfAlNdxl3uYVXnA2evSKBTpU6Ou3oimkejx3fiQ/https/cdn.pg.sa/i7fC8qnbRF.png')
			.setColor('RANDOM')
			.setDescription(`**User:** ${voiceOld}\n**By:** <@${userID}>\n**Channel:** \`\`${voiceOld.voiceChannel.name}\`\``)
			.setTimestamp()
			.setFooter(userTag, userAvatar)

			logChannel.send(serverUndeafv);
		}
	})
// Join Voice Channel
	if(voiceOld.voiceChannelID !== voiceNew.voiceChannelID && !voiceOld.voiceChannel) {
		let voiceJoin = new Discord.RichEmbed()
		.setAuthor(voiceOld.guild.name)
		.setColor('GREEN')
		.setThumbnail(voiceOld.user.avatarURL)
		.setDescription(`:arrow_lower_right: Successfully \`\`JOIN\`\` To Voice Channel.\n\n**Channel:** \`\`${voiceNew.voiceChannel.name}\`\`\n**User:** ${voiceOld}`)
		.setTimestamp()
		.setFooter(voiceOld.user.tag, voiceOld.user.avatarURL)

		logChannel.send(voiceJoin);
	}
// Leave Voice Channel
	if(voiceOld.voiceChannelID !== voiceNew.voiceChannelID && !voiceNew.voiceChannel) {
		let voiceLeave = new Discord.RichEmbed()
		.setAuthor(voiceOld.guild.name)
		.setColor('GREEN')
		.setThumbnail(voiceOld.user.avatarURL)
		.setDescription(`:arrow_upper_left: Successfully \`\`LEAVE\`\` From Voice Channel.\n\n**Channel:** \`\`${voiceOld.voiceChannel.name}\`\`\n**User:** ${voiceOld}`)
		.setTimestamp()
		.setFooter(voiceOld.user.tag, voiceOld.user.avatarURL)

		logChannel.send(voiceLeave);
	}
// Changed Voice Channel
	if(voiceOld.voiceChannelID !== voiceNew.voiceChannelID && voiceNew.voiceChannel && voiceOld.voiceChannel != null) {
		let voiceLeave = new Discord.RichEmbed()
		.setAuthor(voiceOld.guild.name)
		.setColor('GREEN')
		.setThumbnail(voiceOld.user.avatarURL)
		.setDescription(`:repeat: Successfully \`\`CHANGED\`\` The Voice Channel.\n\n**From:** \`\`${voiceOld.voiceChannel.name}\`\`\n**To:** \`\`${voiceNew.voiceChannel.name}\`\`\n**User:** ${voiceOld}`)
		.setTimestamp()
		.setFooter(voiceOld.user.tag, voiceOld.user.avatarURL)

		logChannel.send(voiceLeave);
					    fs.writeFile("./Database/modlogs.json", JSON.stringify(logs), (err) => {
        if (err) console.error(err);
    });
	}
});
//////////////////////////////////////////////////////////////////////////////////////////////////                          
// Report Command
client.on('message', message => {
	    if (!message.channel.guild) return;
    if (!prefixes[message.guild.id]) prefixes[message.guild.id] = {
        prefix: 'h',
    }
    var prefix = prefixes[message.guild.id].prefix
        if (!message.channel.guild) return;
    let args = message.content.split(" ").slice(1);

    if (!r[message.guild.id]) r[message.guild.id] = {
        channel: 'reports',
        onoff: 'Off'
    }

    if (message.content.startsWith(prefix + `report`)) {
        if (!message.mentions.members.first()) return message.reply(`**:x: Error: You must type the person's mention.**`)
        if (!report[message.mentions.users.first().id]) report[message.mentions.users.first().id] = {
            rcase: 0,
        }
        var reports = report[message.mentions.users.first().id];
        var creports = r[message.guild.id];
        if (report[message.mentions.users.first().id].rcase == '3') return message.reply(`**:x: Error: This person has already been reported 3 times**`)
        if (message.mentions.users.first() === message.author) return message.channel.send(`**:x: Error: You can not report yourself.**`);
        if (message.mentions.users.first() === client.user) return message.channel.send(`**:x: Error: You can not report me !**`);

        if (r[message.guild.id].onoff === 'Off') return message.channel.send(`**:x: Error: Reports channel property is disabled, Tell administrators to activate the Feature by command: ${prefix}creport toggle **`)

        if (!args[1]) return message.reply(`**:x: Error: You must write a report message.**`)
        var embed = new Discord.RichEmbed();
        embed.setThumbnail(`${message.author.avatarURL}`)
        embed.setAuthor(message.author.username, message.author.avatarURL)
        embed.setDescription(`**The person mentioned: ${message.mentions.members.first()}
By : ${message.member}
Reason : ${args[1]}**`)
        embed.setFooter(`Case number: ${reports.rcase}`)
        if (message.guild.channels.find('name', creports.channel)) {
            message.guild.channels.find('name', creports.channel).send(embed);
        } else return message.reply(`noreply`);
    }
    fs.writeFile('./Database/report.json', JSON.stringify(report), (err) => {
        if (err) console.error(err)
    });

    fs.writeFile('./Database/rchannel.json', JSON.stringify(r), (err) => {
        if (err) console.error(err)
    });

    fs.writeFile("./Database/prefix.json", JSON.stringify(prefixes), (err) => {
        if (err) console.error(err)
    });

});
//Creport Command
client.on('message', message => {
	    if (!message.channel.guild) return;
    if (!prefixes[message.guild.id]) prefixes[message.guild.id] = {
        prefix: 'h',
    }
    var prefix = prefixes[message.guild.id].prefix
    if (!message.channel.guild) return;
    if (message.author.bot) return;
    var info = r[message.guild.id];
    if (!r[message.guild.id]) r[message.guild.id] = {
        channel: 'reports',
        onoff: 'Off'
    }
   
    
    var sender = message.author;
    if (message.content.startsWith(prefix + 'creport')) {
        if (!message.member.hasPermission(`MANAGE_GUILD`)) return message.reply(`**:x: Error: You do not have the required permissions: Manage Server.**`)
        if (!message.guild.member(client.user).hasPermission('MANAGE_GUILD')) return message.reply('**:x: Error: I dont have the required permissions : MANAGE_GUILD**').catch(console.error);
        let args = message.content.split(" ").slice(1)
        let state = args[0]
        if (!args[0]) return message.reply(`**${prefix}creport toggle/setchannel [channel_name]**`)
        if (!state.trim().toLowerCase() == 'toggle' || !state.trim().toLowerCase() == 'setchannel') return message.reply(`**Please type a right state, ${prefix}creport toggle/setchannel [channel_name]**`)
        if (state.trim().toLowerCase() == 'toggle') {
            if (r[message.guild.id].onoff === 'Off') return [message.channel.send(`**The report channel feature has been activated**`), r[message.guild.id].onoff = 'On']
            if (r[message.guild.id].onoff === 'On') return [message.channel.send(`**The report channel feature has been deactivated**`), r[message.guild.id].onoff = 'Off']
        }
        if (state.trim().toLowerCase() == 'setchannel') {
            let newChannel = message.content.split(" ").slice(2).join(" ")
            if (!newChannel) return message.reply(`**:x: Error: Type the name of the channel ${prefix}report setchannel [channel_name]**`)
            if (!message.guild.channels.find(`name`, newChannel)) return message.reply(`**:x: Error: I can not find the channel**`)
            r[message.guild.id].channel = newChannel
            message.channel.send(`** The report channel role has been changed to :  #${newChannel}**`)
        }
    }
    fs.writeFile("./Database/rchannel.json", JSON.stringify(r), (err) => {
        if (err) console.error(err)
    });
    fs.writeFile("./Database/prefix.json", JSON.stringify(prefixes), (err) => {
        if (err) console.error(err)
    });

});
//SetPrefix Comتهmand
client.on("message", message => {
    if (!message.channel.guild) return;
    if (message.author.bot) return;
    if (!prefixes[message.guild.id]) prefixes[message.guild.id] = {
        prefix: 'h',
    }
    var prefix = prefixes[message.guild.id].prefix
    var setp = prefixes[message.guild.id];
    if (message.content.startsWith(prefix + 'setp')) {
        if (!message.member.hasPermission(`MANAGE_GUILD`)) return message.reply(`**:x: Error: You do not have the required permissions: Manage Server.**`)

        let args = message.content.split(" ").slice(1)

        if (!args.join(" ")) return message.reply(`**:x: Error: Say The Prefix Please.**`)

        message.channel.send(`The New Prefix Set To ${args.join(" ")} !`)
        setp.prefix = args.join()

    }

    fs.writeFile("./Database/prefix.json", JSON.stringify(prefixes), (err) => {
        if (err) console.error(err)
    });
});
// logs Command
client.on('message', message => {
	    if (!message.channel.guild) return;
    if (!prefixes[message.guild.id]) prefixes[message.guild.id] = {
        prefix: 'h',
    };
    var prefix = prefixes[message.guild.id].prefix;
    if (!message.channel.guild) return;
    if (message.author.bot) return;
    if (!logs[message.guild.id]) logs[message.guild.id] = {
        channel: 'logs',
        onoff: 'Off',
    };
    if (message.content.startsWith(prefix + 'logs')) {
        if (!message.member.hasPermission(`MANAGE_GUILD`)) return message.reply(`**:x: Error: You do not have the required permissions: Manage Server.**`);
        if (!message.guild.member(client.user).hasPermission('MANAGE_GUILD')) return message.reply('**:x: Error: I dont have the required permissions : MANAGE_GUILD**').catch(console.error);
        let args = message.content.split(" ").slice(1);
        let state = args[0];
        if (!args[0]) return message.reply(`**${prefix}logs toggle/setchannel [channel_name]**`);
        if (!state.trim().toLowerCase() == 'toggle' || !state.trim().toLowerCase() == 'setchannel') return message.reply(`**Please type a right state, ${prefix}logs toggle/setchannel [channel_name]**`);
        if (state.trim().toLowerCase() == 'toggle') {
            if (logs[message.guild.id].onoff === 'Off') return [message.channel.send(`**The logs channel feature has been activated**`), logs[message.guild.id].onoff = 'On'];
            if (logs[message.guild.id].onoff === 'On') return [message.channel.send(`**The logs channel feature has been deactivated**`), logs[message.guild.id].onoff = 'Off'];
        }
        if (state.trim().toLowerCase() == 'setchannel') {
            let newChannel = message.content.split(" ").slice(2).join(" ")
            if (!newChannel) return message.reply(`**:x: Error: Type the name of the channel ${prefix}logs setchannel [channel_name]**`);
            if (!message.guild.channels.find(`name`, newChannel)) return message.reply(`**:x: Error: I can not find the channel**`);
            logs[message.guild.id].channel = newChannel;
           if(logs[message.guild.id].onoff === 'Off') return message.channel.send(`:x: Error: Logs channel property is disabled \n you activate the Feature by command: **${prefix}logs toggle** `);
          message.channel.send(`** The logs channel has been changed to :  #${newChannel} **`);
                       

        }
    }
    fs.writeFile("./Database/modlogs.json", JSON.stringify(logs), (err) => {
        if (err) console.error(err);
    });
    fs.writeFile("./Database/prefix.json", JSON.stringify(prefixes), (err) => {
        if (err) console.error(err);
    });

});
//////////////////////////////////////////////////////////////////////////////////////////////////
//say Command
client.on('message', message => {
	if (!message.channel.guild) return;
	if (message.author.bot) return;
    if (!prefixes[message.guild.id]) prefixes[message.guild.id] = {
        prefix: 'h',
    };
    var prefix = prefixes[message.guild.id].prefix;
	 let args = message.content.split(" ").slice(1),
	text = args.join(' ').replace('$userid', message.author.id).replace('server-name', message.guild.name);
    if (message.content.startsWith(prefix + "say")) {
	if(!args[0]) return message.channel.send(`Error: You have to write a message .`);
        message.channel.send(text);
            fs.writeFile("./Database/prefix.json", JSON.stringify(prefixes), (err) => {
        if (err) console.error(err)
    });

    }
});
// Ping and status command's
client.on('message', message => {
	if (!message.channel.guild) return;
	if (message.author.bot) return;
    if (!prefixes[message.guild.id]) prefixes[message.guild.id] = {
        prefix: 'h',
    };
    var prefix = prefixes[message.guild.id].prefix;
    if (message.content.startsWith(prefix + `ping`)) {
        return message.channel.send(`Ping : ${Date.now() - message.createdTimestamp}.`);
    }
    fs.writeFile("./Database/prefix.json", JSON.stringify(prefixes), (err) => {
        if (err) console.error(err)
    });

    if (message.author.id !== ownerid) return;
    if (!message.channel.guild) return;
    if (message.author.bot) return;
    if (message.content.startsWith(prefix + 'status')) {
        let uptime = client.uptime;
        let days = 0;
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        let notCompleted = true;
        while (notCompleted) {
            if (uptime >= 8.64e+7) {
                days++;
                uptime -= 8.64e+7;
            } else if (uptime >= 3.6e+6) {
                hours++;
                uptime -= 3.6e+6;
            } else if (uptime >= 60000) {
                minutes++;
                uptime -= 60000;
            } else if (uptime >= 1000) {
                seconds++;
                uptime -= 1000;
            }
            if (uptime < 1000) notCompleted = false;
        }
        moment.locale("en-ca")
        let status = new Discord.RichEmbed()
        status.setColor(00000)
        status.setThumbnail(client.user.avatarURL)
        status.setAuthor(client.user.username, client.user.avatarURL)
        status.setDescription(`
MyPrefix : **[ ${prefix} ]**
Guilds : **[ ${client.guilds.size} ]**
Channels : **[ ${client.channels.size} ]**
Users : **[ ${client.users.size} ]**
MyName : **[ ${client.user.username} ]**
MyID : **[ ${client.user.id} ]**
RamUsage : **[ ${(process.memoryUsage().rss / 1048576).toFixed()}MB ]**
Node.js Version ** [ ${process.version} ]**
CreatedAt : **[ ${moment(client.user.createdAt).fromNow()} ]**
Uptime : **[ ${days}:${hours}:${minutes}:${seconds}. ]**
`);

        let id = message.author.id;
        if (!!statuss[id] && (new Date).getTime() - statuss[id] < 5000) {
            let r = (new Date).getTime() - statuss[id];
            r = 5000 - r;
            message.channel.send(`**Wait  ${pretty(r, {verbose:true})} To Use This Command**`);
        } else {
            message.channel.send({
                embed: status
            });

            statuss[id] = (new Date).getTime()
        }
    }
    fs.writeFile("./Database/prefix.json", JSON.stringify(prefixes), (err) => {
        if (err) console.error(err)
        
    });
});
// Avatar Command
client.on('message', message => {
	if (!message.channel.guild) return;
	if (message.author.bot) return;
    if (!prefixes[message.guild.id]) prefixes[message.guild.id] = {
        prefix: 'h',
    };
    var prefix = prefixes[message.guild.id].prefix;
	if (message.content.startsWith(prefix + 'avatar')) {
	var mention = message.mentions.users.first();
    var member;
     if(mention) {
          member = mention
      } else {
          member = message.author
      }
	const embed = new Discord.RichEmbed();
	    embed.setThumbnail(client.user.avatarURL);
        embed.setAuthor(member.username);
        embed.setColor('RANDOM');
        embed.setImage(member.avatarURL);
        embed.setTimestamp();
        embed.setFooter(message.guild.name , message.guild.iconURL);
    message.channel.send(embed);
                fs.writeFile("./Database/prefix.json", JSON.stringify(prefixes), (err) => {
        if (err) console.error(err)
    });
	}
});
// Server-icon Command
client.on('message', message => {
	if (!message.channel.guild) return;
	if (message.author.bot) return;
    if (!prefixes[message.guild.id]) prefixes[message.guild.id] = {
        prefix: 'h',
    };
    var prefix = prefixes[message.guild.id].prefix;
	if (message.content.startsWith(prefix + 'server-icon')) {
 		const embed = new Discord.RichEmbed();
	    embed.setThumbnail(client.user.avatarURL);
        embed.setAuthor(message.author.username);
        embed.setColor('RANDOM');
        embed.setImage(message.guild.iconURL);
        embed.setTimestamp();
        embed.setFooter(message.guild.name , message.guild.iconURL);
    message.channel.send(embed);
                    fs.writeFile("./Database/prefix.json", JSON.stringify(prefixes), (err) => {
        if (err) console.error(err)
    });
}
});
// Members Command
client.on('message', message => {
	if (!message.channel.guild) return;
	if (message.author.bot) return;
	    if (!prefixes[message.guild.id]) prefixes[message.guild.id] = {
        prefix: 'h',
    };
    var prefix = prefixes[message.guild.id].prefix;
		if (message.content.startsWith(prefix + 'members')) {
		const embed = new Discord.RichEmbed();
		embed.setThumbnail(client.user.avatarURL);
        embed.setAuthor(message.author.username);
        embed.setColor('RANDOM');
        embed.setDescription(`Members Count : ${message.guild.memberCount - message.guild.members.filter(m=>m.user.bot).size} (${message.guild.members.filter(m=>m.user.bot).size} bots) `);
        embed.setTimestamp();
        embed.setFooter(message.guild.name , message.guild.iconURL);
		message.channel.send(embed);
		fs.writeFile("./Database/prefix.json", JSON.stringify(prefixes), (err) => {
        if (err) console.error(err)
    });
		}
});
// invites Command
client.on('message', message => {
	if (!message.channel.guild) return;
	if (message.author.bot) return;
    if (!prefixes[message.guild.id]) prefixes[message.guild.id] = {
        prefix: 'h',
    };
    var prefix = prefixes[message.guild.id].prefix;
    let args = message.content.split(" ").slice(1);

    if (message.content.startsWith(prefix + 'invites')) {
        message.guild.fetchInvites().then(invs => {
            let user = message.mentions.users.first() || message.author;
            let member = client.guilds.get(message.guild.id).members.get(user.id);
            let personalInvites = invs.filter(i => i.inviter.id === user.id);
            let inviteCount = personalInvites.reduce((p, v) => v.uses + p, 0);
            message.channel.send(`**${user} has ${inviteCount} invites.**`);
        });
    };
    fs.writeFile("./Database/prefix.json", JSON.stringify(prefixes), (err) => {
        if (err) console.error(err);
    });
});
// bc Command
client.on('message', message => {
	if (!message.channel.guild) return;
	if (message.author.bot) return;
    let args = message.content.split(" ").slice(1);
    if (!prefixes[message.guild.id]) prefixes[message.guild.id] = {
        prefix: 'h',
    };
    var prefix = prefixes[message.guild.id].prefix;
    if (message.content.startsWith(prefix + 'bc')) {
	if(!args[0]) return message.channel.send(`Error: You have to write a message .`);
	message.channel.send(`Sending message to ${message.guild.memberCount} members ..`);
	message.author.sendMessage(`${args[0]}`)
	}
    fs.writeFile("./Database/prefix.json", JSON.stringify(prefixes), (err) => {
        if (err) console.error(err);
    });
});
// inrole Command
client.on("message", message => {
	if (!message.channel.guild) return;
	if (message.author.bot) return;
    if (!prefixes[message.guild.id]) prefixes[message.guild.id] = {
        prefix: 'h',
    };
    var prefix = prefixes[message.guild.id].prefix;
    if(message.content.startsWith(prefix + "inrole")) { 
        let roleName = message.content.split(" ").slice(1).join(" ").toLowerCase(); 
        if(!roleName) return message.channel.send(`**${prefix}inrole [role_name]**`);
        let role = message.guild.roles.filter(r=>r.name.toLowerCase().indexOf(roleName)>-1).first();
        if( !role ) return message.reply(`**:x: I can't find the role .**`);
        let mem = "";
        let members = message.guild.members.filter( member => member.roles.get(role.id) ).forEach(m=>mem+=m.displayName+"\n");
        if( mem == "" ){
            mem = "No one's have this role.";
        }
        let embed = new Discord.RichEmbed({
            "title": `The people how have ${role.name} role.`, 
            "description": mem, 
            "color": role.color 
        }); 
        message.channel.send({embed});
            fs.writeFile("./Database/prefix.json", JSON.stringify(prefixes), (err) => {
        if (err) console.error(err);
    });
    }
});
// invite Command
client.on('message', message => {
	if (!message.channel.guild) return;
	if (message.author.bot) return;
    if (!prefixes[message.guild.id]) prefixes[message.guild.id] = {
        prefix: 'h',
    };
    var prefix = prefixes[message.guild.id].prefix;	
        if (message.content.startsWith(prefix + 'رابط')) {
    const invite = message.channel.createInvite({
        thing: true,
        maxUses: 2,
        maxAge: 86400
    }).then(invite =>
    message.author.send(`**This is your invite: ${invite.url} \n this invite only 24 hours and you can invite 2 people's only!**`),
    
    message.channel.send(`**This invite for 24 hours and you can invite 2 people's only, See your Dm**`)
    )
        }    
        fs.writeFile("./Database/prefix.json", JSON.stringify(prefixes), (err) => {
        if (err) console.error(err);
    });
});
// invites command
client.on("message", async message => {
            if(!message.channel.guild) return;
        if(message.content.startsWith(prefix + 'invites')) {
        var nul = 0
        var guild = message.guild
        await guild.fetchInvites()
            .then(invites => {
             invites.forEach(invite => {
                if (invite.inviter === message.author) {
                     nul+=invite.uses
                    }
                });
            });
          if (nul > 0) {
              console.log(`\n${message.author.tag} has ${nul} invites in ${guild.name}\n`)
                          message.channel.send(`${message.author.username}`, `لقد قمت بدعوة **${nul}** شخص`);
                      return;
                    } else {
                   
                       message.channel.send(`${message.author.username} لم تقم بدعوة أي شخص لهذة السيرفر`)
                        return;
                    }
        }
});
//////////////////////////////////////////////////////////////////////////////////////////////////
client.on('guildMemberAdd', member => {
  if(!ar[member.guild.id]) ar[member.guild.id] = {
  onoff: 'Off',
  role: 'Member'
  };
  if(ar[member.guild.id].onoff === 'Off') return;
member.addRole(member.guild.roles.find(`name`, ar[member.guild.id].role)).catch(console.error);

    fs.writeFile("./Database/autorole.json", JSON.stringify(ar), (err) => {
    if (err) console.error(err);
  });
});
// Autorole Command
client.on('message', message => { 
  var whitelisted = "455331653309562910"
  var sender = message.author

if(!message.channel.guild) return;
  if(!ar[message.guild.id]) ar[message.guild.id] = {
  onoff: 'Off',
  role: 'Member'
  }

if(message.content.startsWith(prefix + `autorole`)) {
         if(whitelisted.includes(sender.id)) {
  let perms = message.member.hasPermission(`MANAGE_ROLES`)

  if(!perms) return message.reply(`You don't have permissions, required permission : Manage Roles.`)
  let args = message.content.split(" ").slice(1)
  if(!args.join(" ")) return message.reply(`${prefix}autorle toggle/setrole [ROLE NAME]`)
  let state = args[0]
  if(!state.trim().toLowerCase() == 'toggle' || !state.trim().toLowerCase() == 'setrole') return message.reply(`Please type a right state, ${prefix}modlogs toggle/setrole [ROLE NAME]`) 
    if(state.trim().toLowerCase() == 'toggle') { 
     if(ar[message.guild.id].onoff === 'Off') return [message.channel.send(`**The Autorole event has been toggled to on!**`), ar[message.guild.id].onoff = 'On']
     if(ar[message.guild.id].onoff === 'On') return [message.channel.send(`**The Autorole event has been toggled to Off!**`), ar[message.guild.id].onoff = 'Off']
    }
   if(state.trim().toLowerCase() == 'setrole') {
   let newRole = message.content.split(" ").slice(2).join(" ");
   if(!newRole) return message.reply(`${prefix}autorole setrole [ROLE NAME]`)
     if(!message.guild.roles.find(`name`,newRole)) return message.reply(`I can't find this role.`)
    ar[message.guild.id].role = newRole
     message.channel.send(`**The Autorole role has been changed to ${newRole}.**`)
   } 
         }
  }

    fs.writeFile("./Database/autorole.json", JSON.stringify(ar), (err) => {
    if (err) console.error(err)
  });


})
//////////////////////////////////////////////////////////////////////////////////////////////////

client.login(process.env.BOT_TOKEN);
