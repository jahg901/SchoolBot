const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const JoinCourse = new Command(".join ", "join a course", ["course"], (msg, server, args) => {
    const crs = Funcs.findCourse(server, args.course);
    if (crs === null) {
        msg.channel.send(new Discord.MessageEmbed().setDescription(`The course "${args.course}" does not exist.`));
    } else if (crs.students[msg.author.id] === true) {
        msg.channel.send(new Discord.MessageEmbed().setDescription(`You are already enrolled in ${args.course}.`));
    } else {
        crs.students[msg.author.id] = true;
        crs.studentArr.push(msg.author.id);
        msg.channel.send(new Discord.MessageEmbed().setTitle(`You have now joined ${args.course}!`));
    }
}, (msg, e) => { console.log(e) });

module.exports = JoinCourse;