require("dotenv").config();
const Discord = require("discord.js");
const Classes = require("./classes.js");
const Command = require("./command.js");

const token = process.env.DISCORD_TOKEN;
const client = new Discord.Client();

const servers = {};
const commands = [];

commands.push(require("./commands/newcourse.js"));
commands.push(require("./commands/fullcourselist.js"));
commands.push(require("./commands/joincourse.js"));
commands.push(require("./commands/leavecourse.js"));
commands.push(require("./commands/deletecourse.js"));
commands.push(require("./commands/mycourselist.js"));
commands.push(require("./commands/coursestudentlist.js"));
commands.push(require("./commands/newassignment.js"));
commands.push(require("./commands/courseassignmentlist.js"));
commands.push(require("./commands/deleteassignment.js"));
commands.push(require("./commands/viewassignment.js"));
commands.push(require("./commands/editassignment.js"));
commands.push(require("./commands/myassignmentlist.js"));

const Help = new Command(".help", "", [], (msg, server, args) => {
    const e = new Discord.MessageEmbed()
        .setTitle(`${client.user.username} Commands`);
    for (c of commands) {
        e.addField(c.name, c.description);
        if (c.params.length !== 0) {
            e.fields[e.fields.length - 1].name += ` <${c.params}>`;
        }
    }
    msg.channel.send(e);
}, (msg, e) => { console.log(e) });

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", msg => {
    if (!(servers[msg.guild.id] instanceof Classes.Server)) {
        servers[msg.guild.id] = new Classes.Server(msg.guild.id);
    }
    if (msg.content.startsWith(".")) {
        for (c of commands) {
            c.execute(msg, servers[msg.guild.id]);
        }
        Help.execute(msg, servers[msg.guild.id]);
    }
});

client.login(token);