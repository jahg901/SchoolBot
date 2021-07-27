const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const NewCourse = new Command(".newCourse ", "create a new course in your server", ["name"], (msg, server, args) => {
    if (args.name.includes("\n")) {
        msg.channel.send(new Discord.MessageEmbed().setDescription("A course name cannot include any line breaks."));
    } else if (args.name.length > 256) {
        msg.channel.send(new Discord.MessageEmbed().setDescription("A course name cannot be longer than 256 characters."));
    } else if (Funcs.findCourse(server, args.name) !== null) {
        msg.channel.send(new Discord.MessageEmbed().setDescription("A course with this name already exists."));
    } else {
        server.courses.push(new Classes.Course(args.name));
        msg.channel.send(new Discord.MessageEmbed().setTitle("New Course Created!").setDescription(args.name));
    }
}, (msg, e) => { console.log(e) });

module.exports = NewCourse;