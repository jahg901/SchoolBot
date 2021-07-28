const Discord = require("discord.js");

const Classes = require("../classes.js");
const Command = require("../command.js");
const Funcs = require("../functions.js");

const reactionFilter = (authorID) => {
    return ((reaction, user) => {
        return (reaction.emoji.name == '🗑️' || reaction.emoji.name == '❌') && user.id === authorID;
    });
}

const DeleteCourse = new Command(".deleteCourse ", "remove a course", ["course"], (msg, server, args) => {
    const crs = Funcs.findCourse(server, args.course);
    if (crs === null) {
        msg.channel.send(new Discord.MessageEmbed().setDescription(`The course "${args.course}" does not exist.`));
    } else {
        msg.channel.send(new Discord.MessageEmbed().setTitle(`Are you sure you want to delete the course "${args.course}"?`)
            .setDescription("React with 🗑️ to confirm, or ❌ to cancel.")).then(sentMsg => {
                sentMsg.react("🗑️");
                sentMsg.react("❌");
                sentMsg.awaitReactions(reactionFilter(msg.author.id), { max: 1, time: 60000, errors: ["time"] }).then(reaction => {
                    reaction = Array.from(reaction.values())[0]._emoji.name;
                    sentMsg.reactions.removeAll();
                    if (reaction === "🗑️") {
                        for (let i = 0; i < server.courses.length; i++) {
                            if (server.courses[i].name === crs.name) {
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
                    sentMsg.edit(new Discord.MessageEmbed().setDescription("Confirmation timed out; course deletion cancelled."));
                });
            });
    }
}, (msg, e) => { console.log(e) });

module.exports = DeleteCourse;