const { REST } = require('@discordjs/rest');
const { Routes } = require("discord-api-types/v9");

module.exports = {
	name: "ready",
    once: true,
    execute (message, commands, client, dbclient) {
        console.log(client.user.username + " is Ready!");
    
        const CLIENT_ID = client.user.id;

        const rest = new REST ({
            version: "9"
        }).setToken(process.env.TOKEN);
        (async () => {
            try {
                if (process.env.PRODUCTION == "production") {
                    await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: commands
                    });
                    console.log("Successfully registered commands globally.");
                } else {
                    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
                        body: commands
                    });
                    console.log("Successfully registered commands locally.");
                }
            } catch (err) {
                if (err) console.error(err);
            }
        })();
        (async () => {
                client.guilds.cache.forEach(guild => {
                    guild.channels.cache.forEach((channel) => {
                        channel.fetch();
                        try {
                            channel.messages.fetch();
                        } catch (err) {
                        }
                    });
                });
        })();
	}
}