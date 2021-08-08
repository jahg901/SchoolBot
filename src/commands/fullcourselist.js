const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const reactionFilter = (reaction, user) => {
    return (reaction.emoji.name == '⬅️' || reaction.emoji.name == '➡️') && !user.bot;
}

const sendEmbed = (msg, pageNum, courses) => {
    const e = new Discord.MessageEmbed().setTitle("All Courses");
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
                    sendEmbed(sentMsg, pageNum - 1, courses);
                } else if (courses.length > (pageNum + 1) * 10 && reaction === "➡️") {
                    sentMsg.reactions.removeAll();
                    sendEmbed(sentMsg, pageNum + 1, courses);
                }
            });
        }
    });
}

const FullCourseList = new Command(".fullCourseList", "lists all courses", false, [], (msg, server, args) => {
    if (server.courses.length === 0) {
        throw new Error("No courses");
    } else {
        msg.channel.send(new Discord.MessageEmbed().setDescription("Loading...")).then(sentMsg => {
            sendEmbed(sentMsg, 0, server.courses);
        });
    }
}, (msg, e) => {
    if (e.message === "No courses") {
        msg.channel.send(new Discord.MessageEmbed().setDescription("No courses currently exist."));
    } else if (e.message === "Too many arguments") {
        msg.channel.send(new Discord.MessageEmbed().setDescription(`Invalid input: the command ".fullCourseList" takes no arguments.`))
    } else {
        console.log(e);
    }
});

module.exports = FullCourseList;