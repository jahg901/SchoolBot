const Discord = require("discord.js");

const Command = require("../command.js");
const Funcs = require("../functions.js");

const reactionFilter = (reaction, user) => {
    return (reaction.emoji.name == '⬅️' || reaction.emoji.name == '➡️') && !user.bot;
}

const sendEmbed = (msg, pageNum, crs) => {
    const e = new Discord.MessageEmbed()
        .setColor(Funcs.Colors.view)
        .setTitle(crs.name)
        .setDescription(crs.studentArr.length + " Student" + Funcs.pluralize(crs.studentArr.length))
        .addField("\u200B", "\u0000");
    for (let i = pageNum * 10; i < crs.studentArr.length && i < (pageNum + 1) * 10; i++) {
        let student = msg.guild.members.cache.get(crs.studentArr[i])
        if (student.nickname === null) {
            e.fields[0].value += `**${student.user.username}**#${student.user.discriminator}\n`;
        } else {
            e.fields[0].value += `**${student.nickname}** (${student.user.tag})\n`;
        }
    }
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

const CourseStudentList = new Command(".studentList ", "list the students in a course", false, ["course"], (msg, server, args) => {
    const crs = Funcs.findCourse(server, args.course);
    if (crs === null) {
        throw new Error("Invalid course" + args.course);
    } else if (crs.studentArr.length === 0) {
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.view)
            .setTitle(`The course ${args.course} has no students.`));
    } else {
        msg.guild.members.fetch();
        msg.channel.send(new Discord.MessageEmbed().setDescription("Loading...")).then(sentMsg => {
            sendEmbed(sentMsg, 0, crs);
        });
    }
}, (msg, e) => {
    if (e.message.startsWith("Invalid course")) {
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.error)
            .setTitle(`The course "${e.message.substr(14, 128)}" does not exist.`));
    } else {
        console.log(e);
    }
});

module.exports = CourseStudentList;