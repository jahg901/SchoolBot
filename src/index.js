require("dotenv").config();
const Discord = require("discord.js");
const Classes = require("./classes.js");
const Command = require("./command.js");
const DataHandler = require("./datahandler.js");
const WelcomeMessage = require("./welcomemessage");
const fs = require("fs");

const token = process.env.DISCORD_TOKEN;

let client = new Discord.Client();

const commands = [];

fs.promises.readdir("./src/commands").then(files => {
    for (f of files) {
        commands.push(require("./commands/" + f));
    }
});

const Help = new Command(".help", "", false, [], (msg, server, args) => {
    const e = new Discord.MessageEmbed()
        .setTitle(`${client.user.username} Commands`);
    for (let i = 0; i < commands.length; i++) {
        e.addField(commands[i].name, commands[i].description);
        if (e.fields[i].name.endsWith(" ") || e.fields[i].name.endsWith("\n")) {
            e.fields[i].name = e.fields[i].name.substring(0, e.fields[i].name.length - 1);
        }
        if (commands[i].params.length !== 0) {
            e.fields[i].name += ` *<${commands[i].params}>*`;
        }
        if (commands[i].mod) {
            e.fields[i].name += `\n[Mod Command]`;
        }
    }
    msg.channel.send(e);
}, (msg, e) => { console.log(e) });

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("guildCreate", guild => {
    guild.channels.cache.map(channel => {
        if (channel.type === "text" && channel.permissionsFor(client.user).has("VIEW_CHANNEL", "SEND_MESSAGES")) {
            channel.send(WelcomeMessage);
        }
    })
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
            if ((new Date(c.assignments[i].dueDate)).getTime() > Date.now()) {
                c.assignments[i] = new Classes.Assignment(c.assignments[i].name, c.assignments[i].course,
                    new Date(c.assignments[i].dueDate), c.assignments[i].info, servers[s], client);
            } else {
                c.assignments.splice(i, 1);
                i--;
            }
        }
    }
}
console.log("Activated all timers for assignment notification");

client.login(token);
