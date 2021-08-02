require("dotenv").config();
const Discord = require("discord.js");
const Classes = require("./classes.js");

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
    }
});

client.login(token);