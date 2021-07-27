const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const LeaveCourse = new Command(".join ", "join a course", ["course"], (msg, server, args) => {
    const crs = Funcs.findCourse(server, args.course);
    if (crs === null) {
        msg.channel.send(new Discord.MessageEmbed().setDescription(`The course "${args.course}" does not exist.`));
    } else {
        delete crs.students[msg.author.id];
        crs.studentArr.splice(msg.author.id, 1);
        msg.channel.send(new Discord.MessageEmbed().setTitle(`You have now left ${args.course}!`));
    }
}, (msg, e) => { console.log(e) });

module.exports = LeaveCourse;