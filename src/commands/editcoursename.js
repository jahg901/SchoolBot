const Discord = require("discord.js");

const Command = require("../command.js");
const Funcs = require("../functions.js");

const EditCourseName = new Command(".editName\n", "edit the name of a course", true, ["course", "newname"], (msg, server, args) => {
    if (args.course === null || args.newname === null) {
        throw new Error("Too few arguments");
    } else {
        const crs = Funcs.findCourse(server, args.course);
        if (crs === null) {
            throw new Error("Invalid course" + args.course);
        } else if (args.newname.includes("\n")) {
            throw new Error("Line Break");
        } else if (args.newname.length > 128) {
            throw new Error("Too many characters");
        } else if (Funcs.findCourse(server, args.newname) !== null) {
            throw new Error("Already exists");
        } else {
            crs.name = args.newname;
            msg.channel.send(new Discord.MessageEmbed()
                .setColor(Funcs.Colors.success)
                .setTitle("Course name edited!")
                .setDescription(`${args.course} => **${crs.name}**`));
        }
    }
}, (msg, e) => {
    if (e.message === "Too many arguments" || e.message === "Too few arguments") {
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.error)
            .setTitle("Invalid input.")
            .setDescription("Please format your command in the following manner:" +
                `\n\n.editName\n<current course name>\n<new course name>`));
    } else if (e.message.startsWith("Invalid course")) {
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.error)
            .setTitle(`The course "${e.message.substr(14, 128)}" does not exist.`));
    } else if (e.message === "Line Break") {
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
}, "\n");

module.exports = EditCourseName;