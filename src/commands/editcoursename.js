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
            .setTitle(`The course "${e.message.substring(14)}" does not exist.`));
    } else {
        console.log(e);
    }
}, "\n");

module.exports = EditCourseName;