const Embed = require("discord.js").MessageEmbed;
const Funcs = require("./functions.js");

const WelcomeMessage = new Embed()
    .setColor(Funcs.Colors.alert)
    .setTitle("Thank you for inviting SchoolBot to this server!")
    .setDescription(`Administrator, type ".setModRole <@roleMention>" to set a role with permission to perform moderator commands, such as adding and deleting courses and assignments.
    
        Type ".help" to view a list of commands.`);

module.exports = WelcomeMessage;