const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const EditCourseName = new Command(".editName\n", "edit the name of a course", true, ["course", "newname"], (msg, server, args) => {
    if (args.course === null || args.newname === null) {
        throw new Error("Too few arguments");
    } else {
        const crs = Funcs.findCourse(server, args.course);
        if (crs === null) {
            throw new Error("Invalid course" + args.course);
        } else {
            crs.name = args.newname;
            msg.channel.send(new Discord.MessageEmbed().setTitle(`Course name edited!`)
                .setDescription(`${args.course} => **${crs.name}**`));
        }
    }
}, (msg, e) => {
    if (e.message === "Too many arguments" || e.message === "Too few arguments") {
        msg.channel.send(new Discord.MessageEmbed()
            .setDescription("Invalid input. Please format your command in the following manner:" +
                `\n\n.editName\n<current course name>\n<new course name>`));
    } else if (e.message.startsWith("Invalid course")) {
        msg.channel.send(new Discord.MessageEmbed().setDescription(`The course "${e.message.substring("Invalid course".length)}" does not exist.`));
    } else if (e.message === "Backslash") {
        msg.channel.send(new Discord.MessageEmbed().setDescription(`No input can include the character "\\\\".`));
    } else {
        console.log(e);
    }
}, "\n");

module.exports = EditCourseName;