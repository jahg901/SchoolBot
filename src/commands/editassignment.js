const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const edit = (field, content, assignment) => {
    switch (field) {
        case "name":
            assignment.name = content;
            break;

        case "duedate":
            content = Funcs.checkDate(content);
            if (content === null) {
                throw new Error("Invalid date");
            } else {
                assignment.dueDate = content;
            }
            break;

        case "info":
            assignment.info = content;
            break;

        default:
            throw new Error("Invalid field");
    }
    return assignment;
}

const EditAssignment = new Command(".editAssignment\n", "edit an assignment's information, specifying the course, assignment index, field to edit and new content.",
    ["course", "index", "field", "content"], (msg, server, args) => {
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
                    const assignment = edit(args.field, args.content, crs.assignments[args.index - 1]);
                    msg.channel.send(new Discord.MessageEmbed().setTitle("Assignment edited! " + assignment.name)
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
                    `\n\n.editAssignment\n<course name>\n<index>\n<field to edit>\n<new content>` +
                    `\n\nThe index of your assignment can be found by using the command ".assignmentList <course>".` +
                    `\n\nThe field to edit should be either "name", "duedate", or "info".`));
        } else if (e.message.startsWith("Invalid course")) {
            msg.channel.send(new Discord.MessageEmbed().setDescription(`The course "${e.message.substring("Invalid course".length)}" does not exist.`));
        } else if (e.message.startsWith("Invalid index")) {
            msg.channel.send(new Discord.MessageEmbed().setDescription(`Invalid index. Please make sure the index is a `
                + `valid number corresponding to an assignment in your specified course.`));
        } else if (e.message === "Invalid date") {
            msg.channel.send(new Discord.MessageEmbed().setDescription("Invalid date. Please provide a valid date in yyyy/mm/dd format."));
        } else if (e.message === "Invalid field") {
            msg.channel.send(new Discord.MessageEmbed().setDescription(`Invalid field to edit. The field to edit should be either "name", "duedate", or "info".`))
        } else if (e.messgae === "Backslash") {
            msg.channel.send(new Discord.MessageEmbed().setDescription(`No input can include the character "\\\\".`));
        } else {
            console.log(e);
        }
    }, /\n+/);

module.exports = EditAssignment;