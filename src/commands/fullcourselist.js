const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const reactionFilter = (reaction, user) => {
    return (reaction.emoji.name == '⬅️' || reaction.emoji.name == '➡️') && !user.bot;
}

const sendEmbed = (msg, pageNum, server) => {
    const e = new Discord.MessageEmbed().setTitle("All Courses");
    for (let i = pageNum * 10; i < server.courses.length && i < (pageNum + 1) * 10; i++) {
        e.addField(server.courses[i].name, server.courses[i].assignments.length + " Assignment" + Funcs.pluralize(server.courses[i].assignments.length)
            + " | " + server.courses[i].studentArr.length + " Student" + Funcs.pluralize(server.courses[i].studentArr.length));
    }
    msg.edit(e).then(sentMsg => {
        if (pageNum > 0) sentMsg.react("⬅️");
        if (server.courses.length > (pageNum + 1) * 10) sentMsg.react("➡️");
        if (server.courses.length > 10) {
            sentMsg.awaitReactions(reactionFilter, { max: 1, time: 60000, errors: ["time"] }).then(reaction => {
                reaction = Array.from(reaction.values())[0]._emoji.name;
                if (pageNum > 0 && reaction === "⬅️") {
                    sentMsg.reactions.removeAll();
                    sendEmbed(sentMsg, pageNum - 1, server);
                } else if (server.courses.length > (pageNum + 1) * 10 && reaction === "➡️") {
                    sentMsg.reactions.removeAll();
                    sendEmbed(sentMsg, pageNum + 1, server);
                }
            });
        }
    });
}

const FullCourseList = new Command(".fullCourseList", "lists all courses", [], (msg, server, args) => {
    if (server.courses.length === 0) {
        msg.channel.send(new Discord.MessageEmbed().setDescription("No courses currently exist."));
    } else {
        msg.channel.send(new Discord.MessageEmbed().setDescription("Loading...")).then(sentMsg => {
            sendEmbed(sentMsg, 0, server);
        });
    }
}, (msg, e) => { console.log(e) });

module.exports = FullCourseList;