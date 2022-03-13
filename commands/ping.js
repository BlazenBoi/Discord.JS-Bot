const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows the Bot Ping with some information."),
    async execute(interaction, client, db) {
        const collection = db.collection('ping');
        const origtime = Date.now();
        const doc = {
            op: `pingtest${origtime}`,
            origtime: origtime,
        }
        const result = await collection.insertOne(doc);
        const aftime = Date.now();
        const query = { op: `pingtest${origtime}` }
        const btime = Date.now();
        const docm = await collection.findOne(query);
        const otime = docm["origtime"];
        const atime = Date.now();
        const diffr = atime - btime;
        const diffw = aftime - otime;
        const docb = await collection.deleteOne(doc)
        const newdoc = {
            op: `pingtest${origtime}`,
            origtime: origtime,
            aping: Math.round(client.ws.ping),
            wping: diffw,
            rping: diffr
        }
		const newresult = await collection.insertOne(newdoc);
        const Embed = new MessageEmbed()
            .setTitle("Ping Info")
            .setDescription(client.user.username + "'s Ping to " + interaction.guild.name)
            .setFields({
                name: 'API Latency',
                value: `${Math.round(client.ws.ping)}ms`
            }, {
                name: 'DB Latency',
                value: `Read: ${diffr}ms \nWrite: ${diffw}ms`
            })
            
        interaction.reply({
            embeds: [Embed],
            ephemeral: true
        });
    },
};