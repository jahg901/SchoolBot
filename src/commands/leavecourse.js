const Discord = require("discord.js");

const Command = require("../command.js");
const Funcs = require("../functions.js");

const LeaveCourse = new Command(".leave ", "leave a course", false, ["course"], (msg, server, args) => {
    const crs = Funcs.findCourse(server, args.course);
    if (crs === null) {
        throw new Error("Invalid course" + args.course);
    } else if (crs.students[msg.author.id] !== true) {
        throw new Error("Not enrolled");
    } else {
        delete crs.students[msg.author.id];
        crs.studentArr.splice(crs.studentArr.indexOf(msg.author.id), 1);
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.success)
            .setTitle(`You have now left ${args.course}!`));
    }
}, (msg, e) => {
    if (e.message.startsWith("Invalid course")) {
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.error)
            .setTitle(`The course "${e.message.substring(14)}" does not exist.`));
    } else if (e.message === "Not enrolled") {
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.error)
            .setTitle(`You are not enrolled in this course.`));
    } else {
        console.log(e);
    }
});

module.exports = LeaveCourse;