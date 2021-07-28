const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const reactionFilter = (reaction, user) => {
    return (reaction.emoji.name == '⬅️' || reaction.emoji.name == '➡️') && !user.bot;
}

const sendEmbed = (msg, pageNum, crs) => {
    const e = new Discord.MessageEmbed().setTitle(crs.name)
        .setDescription(crs.studentArr.length + " Student" + Funcs.pluralize(crs.studentArr.length));
    for (let i = pageNum * 10; i < crs.studentArr.length && i < (pageNum + 1) * 10; i++) {
        msg.guild.members.fetch(crs.studentArr[i]).then(student => {
            if (student.nickname === null) {
                e.addField(student.user.tag, "\u200B");
            } else {
                e.addField(student.nickname, student.user.tag);
            }
        });
    }
    //this is tricky
    msg.edit(e).then(sentMsg => {
        if (pageNum > 0) sentMsg.react("⬅️");
        if (crs.studentArr.length > (pageNum + 1) * 10) sentMsg.react("➡️");
        if (crs.studentArr.length > 10) {
            sentMsg.awaitReactions(reactionFilter, { max: 1, time: 60000, errors: ["time"] }).then(reaction => {
                reaction = Array.from(reaction.values())[0]._emoji.name;
                if (pageNum > 0 && reaction === "⬅️") {
                    sentMsg.reactions.removeAll();
                    sendEmbed(sentMsg, pageNum - 1, crs);
                } else if (crs.studentArr.length > (pageNum + 1) * 10 && reaction === "➡️") {
                    sentMsg.reactions.removeAll();
                    sendEmbed(sentMsg, pageNum + 1, crs);
                }
            });
        }
    });
}

const CourseStudentList = new Command(".studentList ", "list the students in a course", ["course"], (msg, server, args) => {
    const crs = Funcs.findCourse(server, args.course);
    if (crs === null) {
        msg.channel.send(new Discord.MessageEmbed().setDescription(`The course "${args.course}" does not exist.`));
    } else if (crs.studentArr.length === 0) {
        msg.channel.send(new Discord.MessageEmbed().setDescription(`The course ${args.course} has no students.`));
    } else {
        msg.channel.send(new Discord.MessageEmbed().setDescription("Loading...")).then(sentMsg => {
            sendEmbed(sentMsg, 0, crs);
        });
    }
}, (msg, e) => { console.log(e) });

module.exports = CourseStudentList;