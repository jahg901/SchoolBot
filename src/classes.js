const AssignmentNotify = require("./assignmentnotify.js");

class Course {
    constructor(Name) {
        this.name = Name;
        this.assignments = [];
        this.studentArr = [];
        this.students = {};
    }
}

class Server {
    constructor(ID) {
        this.id = ID;
        this.courses = [];
        this.modRole = null;
    }
}

class Assignment {
    constructor(Name, Course, DueDate, Info, server, client) {
        this.name = Name;
        this.course = Course;
        this.dueDate = DueDate;
        this.info = Info;
        this.notify = AssignmentNotify.newJob(this, server, client);
    }

    reschedule(server, client) {
        this.notify.cancel();
        this.notify = AssignmentNotify.newJob(this, server, client);
    }
}

module.exports = {
    Course: Course,
    Server: Server,
    Assignment: Assignment
}