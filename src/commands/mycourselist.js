const Discord = require("discord.js");

const Command = require("../command.js");
const Funcs = require("../functions.js");

const reactionFilter = (reaction, user) => {
    return (reaction.emoji.name == '⬅️' || reaction.emoji.name == '➡️') && !user.bot;
}

const sendEmbed = (member, msg, pageNum, courses) => {
    const e = new Discord.MessageEmbed()
        .setColor(Funcs.Colors.view)
        .setDescription(courses.length + " Course" + Funcs.pluralize(courses.length));
    if (msg.member.nickname === null) {
        e.setTitle(msg.author.tag);
    } else {
        e.setTitle(msg.member.nickname);
    }
    for (let i = pageNum * 10; i < courses.length && i < (pageNum + 1) * 10; i++) {
        e.addField(courses[i].name, courses[i].assignments.length + " Assignment" + Funcs.pluralize(courses[i].assignments.length)
            + " | " + courses[i].studentArr.length + " Student" + Funcs.pluralize(courses[i].studentArr.length));
    }
    msg.edit(e).then(sentMsg => {
        if (pageNum > 0) sentMsg.react("⬅️");
        if (courses.length > (pageNum + 1) * 10) sentMsg.react("➡️");
        if (courses.length > 10) {
            sentMsg.awaitReactions(reactionFilter, { max: 1, time: 60000, errors: ["time"] }).then(reaction => {
                reaction = Array.from(reaction.values())[0]._emoji.name;
                if (pageNum > 0 && reaction === "⬅️") {
                    sentMsg.reactions.removeAll();
                    sendEmbed(member, sentMsg, pageNum - 1, courses);
                } else if (courses.length > (pageNum + 1) * 10 && reaction === "➡️") {
                    sentMsg.reactions.removeAll();
                    sendEmbed(member, sentMsg, pageNum + 1, courses);
                }
            });
        }
    });
}

const MyCourseList = new Command(".myCourseList", "lists all courses", false, [], (msg, server, args) => {
    const myCourses = [];
    for (c of server.courses) {
        if (c.students[msg.author.id]) {
            myCourses.push(c);
        }
    }
    if (myCourses.length === 0) {
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.view)
            .setTitle("You are not enrolled in any courses."));
    } else {
        msg.channel.send(new Discord.MessageEmbed().setDescription("Loading...")).then(sentMsg => {
            sendEmbed(msg.member, sentMsg, 0, myCourses);
        });
    }
}, (msg, e) => {
    if (e.message === "Too many arguments") {
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.error)
            .setTitle("Invalid input.")
            .setDescription(`The command ".fullCourseList" takes no arguments.`))
    } else {
        console.log(e);
    }
});

module.exports = MyCourseList;