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
    constructor(arr) {
        this.name = arr[0];
        this.course = arr[1];
        this.dueDate = arr[2];
        this.info = arr[3];
    }
}

module.exports = {
    Course : Course,
    Server : Server,
    Assignment : Assignment
}