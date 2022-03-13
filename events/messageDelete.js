module.exports = {
	name: "messageDelete",
    once: false,
    async execute (message, client, dbclient) {
        await dbclient.connect();
        const db = dbclient.db("jsdatabase");
        const collection = db.collection('sniper');
        const time = Date.now();
        const odoc = { cid : message.channel.id }
        const oresult = await collection.findOne(odoc);
        if (oresult != null) {
            const od = await collection.deleteOne(odoc);
        }
        const doc = {
                message: message.cleanContent,
                author: message.author.username,
                aid: message.author.id,
                cid: message.channel.id,
                gid: message.guild.id,
                time: time,
                ctime: message.createdTimestamp
        }
        const result = await collection.insertOne(doc);
    }
}