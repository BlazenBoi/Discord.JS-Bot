const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, Formatters } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("snipe")
        .setDescription("Snipe the most recently deleted message in the server."),
    async execute(interaction, client, db) {
        const collection = db.collection('sniper');
        const query = { cid: interaction.channel.id }
        const docm = await collection.findOne(query);
        const message = docm["message"];
        const author = docm["author"];
        const authorid = docm["aid"];
        const channelid = docm["cid"];
        const guildid = docm["gid"];
        const time = docm["time"];
        const ctime = docm["ctime"];
        const rtime = Math.round(time / 1000);
        const rctime = Math.round(ctime / 1000);
        const Embed = new MessageEmbed()
            .setTitle("Sniper")
            .setFields({
                name: "Author:",
                value: author
            },{
                name: 'Message:',
                value: message
            },{
                name: "Sent:",
                value: `<t:${rctime}:R>`
            },{
                name: "Deleted:",
                value: `<t:${rtime}:R>`
            })
        interaction.reply({
            embeds: [Embed],
            ephemeral: true
        });
    },
};