require("dotenv").config();
const Discord = require("discord.js");
const Classes = require("./classes.js");

const token = process.env.DISCORD_TOKEN;
const client = new Discord.Client();
const servers = {};

const NewCourse = require("./commands/newcourse.js");
const FullCourseList = require("./commands/fullcourselist.js");
const JoinCourse = require("./commands/joincourse.js");
const LeaveCourse = require("./commands/leavecourse.js");
const DeleteCourse = require("./commands/deletecourse.js");
const MyCourseList = require("./commands/mycourselist.js");
const CourseStudentList = require("./commands/coursestudentlist.js");
const NewAssignment = require("./commands/newassignment.js");
const CourseAssignmentList = require("./commands/courseassignmentlist.js");
const DeleteAssignment = require("./commands/deleteassignment.js");

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", msg => {
    if (!(servers[msg.guild.id] instanceof Classes.Server)) {
        servers[msg.guild.id] = new Classes.Server(msg.guild.id);
    }

    NewCourse.execute(msg, servers[msg.guild.id]);
    FullCourseList.execute(msg, servers[msg.guild.id]);
    JoinCourse.execute(msg, servers[msg.guild.id]);
    LeaveCourse.execute(msg, servers[msg.guild.id]);
    DeleteCourse.execute(msg, servers[msg.guild.id]);
    MyCourseList.execute(msg, servers[msg.guild.id]);
    CourseStudentList.execute(msg, servers[msg.guild.id]);
    NewAssignment.execute(msg, servers[msg.guild.id]);
    CourseAssignmentList.execute(msg, servers[msg.guild.id]);
    DeleteAssignment.execute(msg, servers[msg.guild.id]);

});

client.login(token);