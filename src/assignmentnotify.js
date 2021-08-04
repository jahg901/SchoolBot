const Discord = require("discord.js");
const schedule = require("node-schedule");
const findCourse = require("./functions.js").findCourse;

const cronParse = (date => {
    return (`${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} ${date.getDay()}`);
});

const newJob = ((assignment, server, client) => {
    const j = schedule.scheduleJob(cronParse(assignment.dueDate), function (a, s, c) {
        const diff = assignment.dueDate.getFullYear() - new Date(Date.now()).getFullYear();
        if (diff === 0) {
            const crs = findCourse(s, a.course);
            for (st of crs.studentArr) {
                c.users.fetch(st).then(student => {
                    student.send(new Discord.MessageEmbed().setTitle(`${a.name} is due today!`)).catch(() => { });
                });
            }
            this.cancel();
        } else if (diff < 0) {
            this.cancel();
        }
    }.bind(null, assignment, server, client));
    return j;
});

module.exports = { newJob };