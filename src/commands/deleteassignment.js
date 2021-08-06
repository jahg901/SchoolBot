const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const reactionFilter = (authorID) => {
    return ((reaction, user) => {
        return (reaction.emoji.name == '🗑️' || reaction.emoji.name == '❌') && user.id === authorID;
    });
}

const DeleteAssignment = new Command(".deleteAssignment\n", "remove an assignment from a course, specifying the course and assignment index",
    ["course", "index"], (msg, server, args) => {
        if (args.course === null || args.index === null) {
            throw new Error("Too few arguments");
        } else {
            const crs = Funcs.findCourse(server, args.course);
            if (crs === null) {
                throw new Error("Invalid course" + args.course);
            } else {
                args.index = parseInt(args.index)
                if (!(args.index === args.index) || args.index < 1 || args.index > crs.assignments.length) {
                    throw new Error("Invalid index")
                } else if (Funcs.deleteInProgress) {
                    throw new Error("Active request");
                } else {
                    Funcs.deleteInProgress = true;
                    const assignment = crs.assignments[args.index - 1];
                    msg.channel.send(new Discord.MessageEmbed().setTitle(`Are you sure you want to delete this assignment?`)
                        .setDescription(assignment.name)
                        .addFields(
                            { name: 'Course: ', value: assignment.course, inline: true },
                            { name: 'Due Date: ', value: Funcs.dateFormat.format(assignment.dueDate), inline: true },
                            { name: '\u200B', value: "React with 🗑️ to confirm, or ❌ to cancel." }
                        )).then(sentMsg => {
                            sentMsg.react("🗑️");
                            sentMsg.react("❌");
                            sentMsg.awaitReactions(reactionFilter(msg.author.id), { max: 1, time: 60000, errors: ["time"] }).then(reaction => {
                                reaction = Array.from(reaction.values())[0]._emoji.name;
                                sentMsg.reactions.removeAll();
                                Funcs.deleteInProgress = false;
                                if (reaction === "🗑️") {
                                    for (let i = 0; i < crs.assignments.length; i++) {
                                        if (crs.assignments[i] === assignment) {
                                            for (j of crs.assignments[i].notify) {
                                                try {
                                                    j.cancel();
                                                } catch (e) { };
                                            }
                                            crs.assignments.splice(i, 1);
                                            break;
                                        }
                                    }
                                    sentMsg.edit(new Discord.MessageEmbed().setTitle("Assignment deleted."));
                                } else {
                                    sentMsg.edit(new Discord.MessageEmbed().setDescription("Assignment deletion cancelled."));
                                }
                            }).catch(() => {
                                sentMsg.reactions.removeAll();
                                Funcs.deleteInProgress = false;
                                sentMsg.edit(new Discord.MessageEmbed().setDescription("Confirmation timed out; assignment deletion cancelled."));
                            });
                        });
                }
            }
        }
    }, (msg, e) => {
        if (e.message === "Too many arguments" || e.message === "Too few arguments") {
            msg.channel.send(new Discord.MessageEmbed()
                .setDescription("Invalid input. Please format your command in the following manner:" +
                    `\n\n.deleteAssignment\n<course name>\n<index>\n\n(The index of your assignment can be found by using the command ".assignmentList <course>".)`));
        } else if (e.message === "Active request") {
            msg.channel.send(new Discord.MessageEmbed().setTitle("There can only be one active course/assignment deletion request at once.")
                .setDescription("Please wait until there is no active request to delete a course or assignment."));
        } else if (e.message.startsWith("Invalid course")) {
            msg.channel.send(new Discord.MessageEmbed().setDescription(`The course "${e.message.substring("Invalid course".length)}" does not exist.`));
        } else if (e.message.startsWith("Invalid index")) {
            msg.channel.send(new Discord.MessageEmbed().setDescription(`Invalid index. Please make sure the index is a `
                + `valid number corresponding to an assignment in your specified course.`));
        } else if (e.messgae === "Backslash") {
            msg.channel.send(new Discord.MessageEmbed().setDescription(`No input can include the character "\\\\".`));
        } else {
            console.log(e);
        }
    }, /\n+/);

module.exports = DeleteAssignment;