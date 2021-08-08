const Discord = require("discord.js");

const Command = require("../command.js");
const Funcs = require("../functions.js");

const JoinCourse = new Command(".join ", "join a course", false, ["course"], (msg, server, args) => {
    const crs = Funcs.findCourse(server, args.course);
    if (crs === null) {
        throw new Error("Invalid course" + args.course);
    } else if (crs.students[msg.author.id] === true) {
        throw new Error("Already enrolled");
    } else {
        crs.students[msg.author.id] = true;
        crs.studentArr.push(msg.author.id);
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.success)
            .setTitle(`You have now joined ${args.course}!`));
    }
}, (msg, e) => {
    if (e.message.startsWith("Invalid course")) {
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.error)
            .setTitle(`The course "${e.message.substr(14, 128)}" does not exist.`));
    } else if (e.message === "Already enrolled") {
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.error)
            .setTitle("You are already enrolled in this course."));
    } else {
        console.log(e);
    }
});

module.exports = JoinCourse;