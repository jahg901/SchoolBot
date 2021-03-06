const Discord = require("discord.js");

const Command = require("../command.js");
const Funcs = require("../functions.js");

const reactionFilter = (authorID) => {
    return ((reaction, user) => {
        return (reaction.emoji.name == '🗑️' || reaction.emoji.name == '❌') && user.id === authorID;
    });
}

const DeleteAssignment = new Command(".deleteAssignment\n", "remove an assignment from a course, specifying the course and assignment index", true,
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
                    msg.channel.send(new Discord.MessageEmbed()
                        .setColor(Funcs.Colors.confirmation)
                        .setTitle(`Are you sure you want to delete this assignment?`)
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
                                    sentMsg.edit(new Discord.MessageEmbed()
                                        .setColor(Funcs.Colors.success)
                                        .setTitle("Assignment deleted."));
                                } else {
                                    sentMsg.edit(new Discord.MessageEmbed()
                                        .setColor(Funcs.Colors.error)
                                        .setTitle("Assignment deletion cancelled."));
                                }
                            }).catch(() => {
                                sentMsg.reactions.removeAll();
                                Funcs.deleteInProgress = false;
                                sentMsg.edit(new Discord.MessageEmbed()
                                    .setColor(Funcs.Colors.error)
                                    .setTitle("Confirmation timed out; assignment deletion cancelled."));
                            });
                        });
                }
            }
        }
    }, (msg, e) => {
        if (e.message === "Too many arguments" || e.message === "Too few arguments") {
            msg.channel.send(new Discord.MessageEmbed()
                .setColor(Funcs.Colors.error)
                .setTitle("Invalid input.")
                .setDescription("Please format your command in the following manner:" +
                    `\n\n.deleteAssignment\n<course name>\n<index>\n\n(The index of your assignment can be found by using the command ".assignmentList <course>".)`));
        } else if (e.message === "Active request") {
            msg.channel.send(new Discord.MessageEmbed()
                .setColor(Funcs.Colors.error)
                .setTitle("There can only be one active course/assignment deletion request at once.")
                .setDescription("Please wait until there is no active request to delete a course or assignment."));
        } else if (e.message.startsWith("Invalid course")) {
            msg.channel.send(new Discord.MessageEmbed()
                .setColor(Funcs.Colors.error)
                .setTitle(`The course "${e.message.substr(14, 128)}" does not exist.`));
        } else if (e.message.startsWith("Invalid index")) {
            msg.channel.send(new Discord.MessageEmbed()
                .setColor(Funcs.Colors.error)
                .setTitle("Invalid index.")
                .setDescription("Please make sure the index is a valid number corresponding to an assignment in your specified course."));
        } else {
            console.log(e);
        }
    }, /\n+/);

module.exports = DeleteAssignment;