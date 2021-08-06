const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const NewAssignment = new Command(".newAssignment\n",
    "create a new assignment in an existing course, specifying due date and additional information",
    ["name", "course", "dueDate", "info"], (msg, server, args, client) => {
        if (args.name === null || args.course === null || args.dueDate === null || args.info === null) {
            throw new Error("Too few arguments");
        } else {
            const crs = Funcs.findCourse(server, args.course);
            args.dueDate = Funcs.checkDate(args.dueDate);
            if (crs === null) {
                throw new Error("Invalid course" + args.course);
            } else if (args.dueDate === null) {
                throw new Error("Invalid date");
            } else if (args.dueDate.getTime() <= Date.now()) {
                throw new Error("Date in past");
            } else {
                crs.assignments.push(new Classes.Assignment(args.name, args.course, args.dueDate, args.info, server, client));
                msg.channel.send(new Discord.MessageEmbed().setTitle("New assignment created! " + args.name).setDescription(args.info)
                    .addFields(
                        { name: 'Course: ', value: args.course, inline: true },
                        { name: 'Due Date: ', value: Funcs.dateFormat.format(args.dueDate), inline: true },
                    ));
            }
        }
    }, (msg, e) => {
        if (e.message === "Too many arguments" || e.message === "Too few arguments") {
            msg.channel.send(new Discord.MessageEmbed()
                .setDescription("Invalid input. Please format your command in the following manner:" +
                    "\n\n.newAssignment\n<assignment name>\n<course>\n<due date (yyyy/mm/dd)>\n<additional info>"));
        } else if (e.message.startsWith("Invalid course")) {
            msg.channel.send(new Discord.MessageEmbed().setDescription(`The course "${e.message.substring("Invalid course".length)}" does not exist.`));
        } else if (e.message === "Invalid date") {
            msg.channel.send(new Discord.MessageEmbed().setDescription("Invalid date. Please provide a valid date in yyyy/mm/dd format."));
        } else if (e.message === "Date in past") {
            msg.channel.send(new Discord.MessageEmbed().setDescription("The provided due date is in the past. Please provide a due date in the future."));
        } else if (e.messgae === "Backslash") {
            msg.channel.send(new Discord.MessageEmbed().setDescription(`No input can include the character "\\\\".`));
        } else {
            console.log(e);
        }
    }, /\n+/);

module.exports = NewAssignment;