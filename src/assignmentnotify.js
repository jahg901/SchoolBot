const Discord = require("discord.js");
const schedule = require("node-schedule");
const findCourse = require("./functions.js").findCourse;

const cronParse = (date => {
    return (`${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} ${date.getDay()}`);
});

const newJob = ((assignment, server, client) => {

    const d = new Date(assignment.dueDate.getTime());
    d.setDate(d.getDate() - 1);
    let job1;
    if (d.getTime() > Date.now()) {
        job1 = schedule.scheduleJob(cronParse(d), function (a, s, c) {
            const diff = d.getFullYear() - new Date(Date.now()).getFullYear();
            if (diff === 0) {
                const crs = findCourse(s, a.course);
                for (st of crs.studentArr) {
                    c.users.fetch(st).then(student => {
                        student.send(new Discord.MessageEmbed()
                            .setColor(Funcs.Colors.alert)
                            .setTitle(`${a.name} is due in one day!`)).catch(() => { });
                    });
                }
                job1.cancel();
            } else if (diff < 0) {
                job1.cancel();
            }
        }.bind(null, assignment, server, client));
    } else {
        job1 = null;
    }

    const job2 = schedule.scheduleJob(cronParse(assignment.dueDate), function (a, s) {
        const diff = assignment.dueDate.getFullYear() - new Date(Date.now()).getFullYear();
        if (diff <= 0) {
            const crs = findCourse(s, a.course);
            if (crs !== null) {
                for (let i = 0; i < crs.assignments.length; i++) {
                    if (crs.assignments[i] === a) {
                        crs.assignments.splice(i, 1);
                        break;
                    }
                }
            }
            job2.cancel();
        }
    }.bind(null, assignment, server));

    return [job1, job2];
});

module.exports = { newJob };