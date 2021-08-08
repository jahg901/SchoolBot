const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const reactionFilter = (authorID) => {
    return ((reaction, user) => {
        return (reaction.emoji.name == '🗑️' || reaction.emoji.name == '❌') && user.id === authorID;
    });
}

const DeleteCourse = new Command(".deleteCourse ", "remove a course", true, ["course"], (msg, server, args) => {
    const crs = Funcs.findCourse(server, args.course);
    if (crs === null) {
        throw new Error("Invalid course" + args.course);
    } else if (Funcs.deleteInProgress) {
        throw new Error("Active request");
    } else {
        Funcs.deleteInProgress = true;
        msg.channel.send(new Discord.MessageEmbed().setTitle(`Are you sure you want to delete the course "${args.course}"?`)
            .setDescription("React with 🗑️ to confirm, or ❌ to cancel.")).then(sentMsg => {
                sentMsg.react("🗑️");
                sentMsg.react("❌");
                sentMsg.awaitReactions(reactionFilter(msg.author.id), { max: 1, time: 60000, errors: ["time"] }).then(reaction => {
                    reaction = Array.from(reaction.values())[0]._emoji.name;
                    sentMsg.reactions.removeAll();
                    Funcs.deleteInProgress = false;
                    if (reaction === "🗑️") {
                        for (let i = 0; i < server.courses.length; i++) {
                            if (server.courses[i].name === crs.name) {
                                for (a of crs.assignments) {
                                    for (j of a.notify()) {
                                        try {
                                            a.cancel();
                                        } catch (e) { };
                                    }
                                }
                                server.courses.splice(i, 1);
                                break;
                            }
                        }
                        sentMsg.edit(new Discord.MessageEmbed().setTitle("Course deleted."));
                    } else {
                        sentMsg.edit(new Discord.MessageEmbed().setDescription("Course deletion cancelled."));
                    }
                }).catch(() => {
                    sentMsg.reactions.removeAll();
                    Funcs.deleteInProgress = false;
                    sentMsg.edit(new Discord.MessageEmbed().setDescription("Confirmation timed out; course deletion cancelled."));
                });
            });
    }
}, (msg, e) => {
    if (e.message.startsWith("Invalid course")) {
        msg.channel.send(new Discord.MessageEmbed().setDescription(`The course "${e.message.substring("Invalid course".length)}" does not exist.`));
    } else if (e.message === "Active request") {
        msg.channel.send(new Discord.MessageEmbed().setTitle("There can only be one active course/assignment deletion request at once.")
            .setDescription("Please wait until there is no active request to delete a course or assignment."));
    } else if (e.message === "Backslash") {
        msg.channel.send(new Discord.MessageEmbed().setDescription(`No input can include the character "\\\\".`));
    } else {
        console.log(e);
    }
});

module.exports = DeleteCourse;