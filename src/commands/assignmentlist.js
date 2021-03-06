const Discord = require("discord.js");

const Command = require("../command.js");
const Funcs = require("../functions.js");

const reactionFilter = (reaction, user) => {
    return (reaction.emoji.name == '⬅️' || reaction.emoji.name == '➡️') && !user.bot;
}

const sendEmbed = (msg, pageNum, crs) => {
    const e = new Discord.MessageEmbed().setTitle(crs.name)
        .setColor(Funcs.Colors.view)
        .setDescription(crs.assignments.length + " Assignment" + Funcs.pluralize(crs.assignments.length));
    for (let i = pageNum * 10; i < crs.assignments.length && i < (pageNum + 1) * 10; i++) {
        e.addField(`${i + 1}. ${crs.assignments[i].name}`, `Due ${Funcs.dateFormat.format(crs.assignments[i].dueDate)}`);
    }
    msg.edit(e).then(sentMsg => {
        if (pageNum > 0) sentMsg.react("⬅️");
        if (crs.assignments.length > (pageNum + 1) * 10) sentMsg.react("➡️");
        if (crs.assignments.length > 10) {
            sentMsg.awaitReactions(reactionFilter, { max: 1, time: 60000, errors: ["time"] }).then(reaction => {
                reaction = Array.from(reaction.values())[0]._emoji.name;
                if (pageNum > 0 && reaction === "⬅️") {
                    sentMsg.reactions.removeAll();
                    sendEmbed(sentMsg, pageNum - 1, crs);
                } else if (crs.assignments.length > (pageNum + 1) * 10 && reaction === "➡️") {
                    sentMsg.reactions.removeAll();
                    sendEmbed(sentMsg, pageNum + 1, crs);
                }
            });
        }
    });
}

const CourseAssignmentList = new Command(".assignmentList ", "list the assignments in a course", false, ["course"], (msg, server, args) => {
    const crs = Funcs.findCourse(server, args.course);
    if (crs === null) {
        throw new Error("Invalid course" + args.course);
    } else if (crs.assignments.length === 0) {
        msg.channel.send(new Discord.MessageEmbed()
            .setColor(Funcs.Colors.view)
            .setTitle(`The course ${args.course} has no assignments.`));
    } else {
        crs.assignments.sort((a, b) => (a.dueDate > b.dueDate) ? 1 : -1);
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

module.exports = CourseAssignmentList;