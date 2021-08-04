require("dotenv").config();
const Discord = require("discord.js");
const Classes = require("./classes.js");
const Command = require("./command.js");
const DataHandler = require("./datahandler.js");
const fs = require("fs");

const token = process.env.DISCORD_TOKEN;

let client = new Discord.Client();

const commands = [];

fs.promises.readdir("./src/commands").then(files => {
    for (f of files) {
        commands.push(require("./commands/" + f));
    }
});

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
    if (msg.guild !== null) {
        if (!(msg.guild.id in servers)) {
            servers[msg.guild.id] = new Classes.Server(msg.guild.id);
        }
        if (msg.content.startsWith(".")) {
            for (c of commands) {
                c.execute(msg, servers[msg.guild.id], client);
            }
            Help.execute(msg, servers[msg.guild.id]);

        }
    }
});

process.on("SIGINT", () => {
    console.log("\n");
    process.exit();
});

process.on("exit", () => {
    DataHandler.SaveData(servers);
});

const servers = DataHandler.ReadData();
console.log("Loaded data into servers object");

for (s in servers) {
    for (c of servers[s].courses) {
        for (let i = 0; i < c.assignments.length; i++) {
            c.assignments[i] = new Classes.Assignment(c.assignments[i].name, c.assignments[i].course,
                new Date(c.assignments[i].dueDate), c.assignments[i].info, servers[s], client);
        }
    }
}
console.log("Activated all timers for assignment notification");

client.login(token);
