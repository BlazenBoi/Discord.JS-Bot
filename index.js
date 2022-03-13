const { Client, Intents, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require("discord-api-types/v9");
const { MongoClient } = require("mongodb");
const { joinVoiceChannel } = require('@discordjs/voice');
const fs = require('fs');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
require('dotenv').config();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

const dbclient = new MongoClient(process.env.MONGO);

async function run() {
    try {
        // Connect the client to the server
        await dbclient.connect();
        // Establish and verify connection
        const db = dbclient.db("jsdatabase");
        const collection = db.collection('main');
        console.log("Connected successfully to server");
    } finally {
        // Ensures that the client will close when you finish/error
        await dbclient.close();
    }
  }
run().catch(console.dir);

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith('.js'));
const commands = [];
client.commands = new Collection();
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
    if (file == "ready.js") {
        client.once(event.name, (...args) => event.execute(...args, commands, client, dbclient));
    } else if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client, dbclient));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client, dbclient));
	}
}

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    await dbclient.connect();
    const db = dbclient.db("jsdatabase");

    if (!command) return;

    try {
        await command.execute(interaction, client, db);
    } catch (err) {
        if (err) console.error(err);

        await interaction.reply({
            content: "An Error Occured while executing that command.",
            ephemeral: true
        });
    }
})

client.login(process.env.TOKEN)