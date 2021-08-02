const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const ViewAssignment = new Command(".view\n", "view an assignment's information, specifying the course and assignment index",
    ["course", "index"], (msg, server, args) => {
        if (args.course === null || args.index === null) {
            throw new Error("Too few arguments");
        } else {
            const crs = Funcs.findCourse(server, args.course);
            if (crs === null) {
                throw new Error("Invalid course" + args.course);
            } else {
                args.index = parseInt(args.index)
                if (!(args.index === args.index) || args.index < 1 || args.index > crs.assignments.length) {
                    throw new Error("Invalid index")
                } else {
                    const assignment = crs.assignments[args.index - 1];
                    msg.channel.send(new Discord.MessageEmbed().setTitle(assignment.name)
                        .setDescription(assignment.info)
                        .addFields(
                            { name: 'Course: ', value: assignment.course, inline: true },
                            { name: 'Due Date: ', value: Funcs.dateFormat.format(assignment.dueDate), inline: true },
                        ));
                }
            }
        }
    }, (msg, e) => {
        if (e.message === "Too many arguments" || e.message === "Too few arguments") {
            msg.channel.send(new Discord.MessageEmbed()
                .setDescription("Invalid input. Please format your command in the following manner:" +
                    `\n\n.view\n<course name>\n<index>\n\n(The index of your assignment can be found by using the command ".assignmentList <course>".)`));
        } else if (e.message.startsWith("Invalid course")) {
            msg.channel.send(new Discord.MessageEmbed().setDescription(`The course "${e.message.substring("Invalid course".length)}" does not exist.`));
        } else if (e.message.startsWith("Invalid index")) {
            msg.channel.send(new Discord.MessageEmbed().setDescription(`Invalid index. Please make sure the index is a `
                + `valid number corresponding to an assignment in your specified course.`));
        } else if (e.messgae === "Backslash") {
            msg.channel.send(new Discord.MessageEmbed().setDescription(`No input can include the character "\\\\".`));
        } else {
            console.log(e);
        }
    }, /\n+/);

module.exports = ViewAssignment;