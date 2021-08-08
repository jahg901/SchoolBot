const Colors = {
    success: "#00ff00",
    error: "#ff0000",
    view: "#0088ff",
    confirmation: "#ffff00",
    alert: "#ffffff"
}

function findCourse(s, c) {
    for (let i = 0; i < s.courses.length; i++) {
        if (s.courses[i].name === c) {
            return s.courses[i];
        }
    }
    return null;
}

function checkDate(d) {
    if (/\d{4}[. '/,-]\d{2}[. '/,-]\d{2}/.test(d) && d.length === 10) {

        d = d.split(/[. '/,\-]/);
        for (let i = 0; i < 3; i++) {
            d[i] = parseInt(d[i]);
        }
        d[1] = d[1] - 1;
        let date = new Date(...d);
        if (date.getUTCFullYear() !== d[0]
            || date.getUTCMonth() !== d[1]) {
            return null;
        } else {
            return date;
        }

    } else if ((/\d{4}[. '/,-]\d{2}[. '/,-]\d{2} \d:\d{2}/.test(d) && d.length === 15)
        || (/\d{4}[. '/,-]\d{2}[. '/,-]\d{2} \d{2}:\d{2}/.test(d) && d.length === 16)) {

        d = d.split(/[. '/,\-:]/);
        for (let i = 0; i < 5; i++) {
            d[i] = parseInt(d[i]);
        }
        d[1] = d[1] - 1;
        let date = new Date(...d);
        if (date.getFullYear() !== d[0]
            || date.getMonth() !== d[1]
            || date.getDate() !== d[2]
            || date.getHours() !== d[3]) {
            return null;
        } else {
            return date;
        }

    } else {
        return null;
    }
}

const dateFormat = new Intl.DateTimeFormat('en-US',
    { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });

function pluralize(value) {
    if (value === 1) {
        return ("");
    } else {
        return ("s");
    }
}

let deleteInProgress = false;

module.exports = {
    Colors,
    findCourse,
    checkDate,
    dateFormat,
    pluralize,
    deleteInProgress
}