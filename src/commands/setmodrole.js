const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const SetModRole = new Command(".setModRole ", "set the role given permission to execute moderator commands with this bot", false, ["role"], (msg, server, args) => {
    if (msg.member.hasPermission("ADMINISTRATOR")) {
        const match = args.role.match(/<@&\d+>/);
        if (match === null) {
            throw new Error("Invalid input");
        } else {
            if (match[0] === args.role) {
                const role = msg.mentions.roles.first();
                if (role === undefined) {
                    throw new Error("Invalid input");
                } else {
                    server.modRole = role.id;
                    msg.channel.send(new Discord.MessageEmbed().setTitle("Moderator role set!")
                        .setDescription(`Only members with the ${role} role will be able to perform moderator commands.`));
                }
            }
        }
    } else {
        throw new Error("No permission");
    }
}, (msg, e) => {
    if (e.message === "No permission") {
        msg.channel.send(new Discord.MessageEmbed().setTitle("Sorry, only a member with administrator permissions can perform this command."));
    } else if (e.message === "Invalid input") {
        msg.channel.send(new Discord.MessageEmbed().setTitle("Invalid input. Please follow your command with a valid role @mention."));
    } else {
        console.log(e);
    }
});

module.exports = SetModRole;