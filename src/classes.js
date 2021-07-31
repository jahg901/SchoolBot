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
    }
}

class Assignment {
    constructor(Name, Course, DueDate, Info) {
        this.name = Name;
        this.course = Course;
        this.dueDate = DueDate;
        this.info = Info;
    }
}

module.exports = {
    Course: Course,
    Server: Server,
    Assignment: Assignment
}