const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const reactionFilter = (reaction, user) => {
    return (reaction.emoji.name == '⬅️' || reaction.emoji.name == '➡️') && !user.bot;
}

const sendEmbed = (msg, pageNum, myAssignments) => {
    const e = new Discord.MessageEmbed().setTitle(msg.member.nickname);
    if (msg.member.nickname === null) e.setTitle(msg.author.tag);
    e.setDescription(myAssignments.length + " Assignment" + Funcs.pluralize(myAssignments.length));

    for (let i = pageNum * 10; i < myAssignments.length && i < (pageNum + 1) * 10; i++) {
        e.addField(`${i + 1}. ${myAssignments[i].name}`, `Due ${Funcs.dateFormat.format(myAssignments[i].dueDate)}`);
    }
    msg.edit(e).then(sentMsg => {
        if (pageNum > 0) sentMsg.react("⬅️");
        if (myAssignments.length > (pageNum + 1) * 10) sentMsg.react("➡️");
        if (myAssignments.length > 10) {
            sentMsg.awaitReactions(reactionFilter, { max: 1, time: 60000, errors: ["time"] }).then(reaction => {
                reaction = Array.from(reaction.values())[0]._emoji.name;
                if (pageNum > 0 && reaction === "⬅️") {
                    sentMsg.reactions.removeAll();
                    sendEmbed(sentMsg, pageNum - 1, myAssignments);
                } else if (myAssignments.length > (pageNum + 1) * 10 && reaction === "➡️") {
                    sentMsg.reactions.removeAll();
                    sendEmbed(sentMsg, pageNum + 1, myAssignments);
                }
            });
        }
    });
}

const MyAssignmentList = new Command(".myAssignmentList", "list the assignments in all courses you are enrolled in", [], (msg, server, args) => {
    const myAssignments = [];
    for (c of server.courses) {
        if (c.students[msg.author.id] === true) {
            myAssignments.push(...c.assignments);
        }
    }
    if (myAssignments.length === 0) {
        throw new Error("No assignments" + args.course);
    } else {
        myAssignments.sort((a, b) => (a.dueDate > b.dueDate) ? 1 : -1);
        msg.channel.send(new Discord.MessageEmbed().setDescription("Loading...")).then(sentMsg => {
            sendEmbed(sentMsg, 0, myAssignments);
        });
    }
}, (msg, e) => {
    if (e.message.startsWith("No assignments")) {
        msg.channel.send(new Discord.MessageEmbed().setDescription(`You currently have no assignments.`));
    } else if (e.message === "Too many arguments") {
        msg.channel.send(new Discord.MessageEmbed().setDescription(`Invalid input: the command ".fullCourseList" takes no arguments.`))
    } else {
        console.log(e);
    }
});

module.exports = MyAssignmentList;