const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const NewCourse = new Command(".newCourse ", "create a new course in your server", true, ["name"], (msg, server, args) => {
    if (args.name.includes("\n")) {
        throw new Error("Line Break");
    } else if (args.name.length > 128) {
        throw new Error("Too many characters");
    } else if (Funcs.findCourse(server, args.name) !== null) {
        throw new Error("Already exists");
    } else {
        server.courses.push(new Classes.Course(args.name));
        msg.channel.send(new Discord.MessageEmbed()
	.setColor(Funcs.Colors.success)
	.setTitle("New Course Created!")
	.setDescription(args.name));
    }
}, (msg, e) => {
    if (e.message === "Line Break") {
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.error)
            .setTitle("Invalid name.")
            .setDescription("A course name cannot include any line breaks."));
    } else if (e.message === "Too many characters") {
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.error)
            .setTitle("Invalid name.")
            .setDescription("A course name cannot be longer than 128 characters."));
    } else if (e.message === "Already exists") {
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.error)
            .setTitle("A course with this name already exists."));
    } else {
        console.log(e);
    }
});

module.exports = NewCourse;