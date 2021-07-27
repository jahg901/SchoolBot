const Discord = require("discord.js");

const token = process.env.DISCORD_TOKEN;
const client = new Discord.Client();

function findCourse(s, c) {
    if (!(s instanceof server)) {
        return null;
    }
    for (let i = 0; i < s.courses.length; i++) {
        if (s.courses[i].name === c) {
            return s.courses[i];
        }
    }
    return null;
}

function checkDate(d) {
    if (!/\d{4}[. '/,-]\d{2}[. '/,-]\d{2}/.test(d)
        || d.length !== 10) {
        return null;
    } else {
        d = d.split(/[. '/,-]/);
        for (let i = 0; i < 3; i++) {
            d[i] = parseInt(d[i]);
        }
        let date = new Date(d[0], d[1] - 1, d[2]);
        if (date.getUTCFullYear() !== d[0]
            || date.getUTCMonth() !== d[1] - 1) {
            return null;
        } else {
            return date;
        }
    }
}

const dateFormat = new Intl.DateTimeFormat('en-US',
    { year: 'numeric', month: 'long', day: 'numeric' });

const servers = {};

client.login(token);