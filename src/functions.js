const Classes = require("./classes.js");

function findCourse(s, c) {
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

function pluralize(value) {
    if (value === 1) {
        return ("");
    } else {
        return ("s");
    }
}

let deleteInProgress = false;

module.exports = {
    findCourse,
    checkDate,
    dateFormat,
    pluralize,
    deleteInProgress
}