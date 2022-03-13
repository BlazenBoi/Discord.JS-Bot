module.exports = {
	name: "messageCreate",
    once: false,
    async execute (message, client, dbclient) {
        await dbclient.connect();
        const db = dbclient.db("jsdatabase");
        const collection = db.collection('userinfo');
        const odoc = { uid : message.author.id }
        const oresult = await collection.findOne(odoc);
        if (oresult != null) {
            const mid = message.guild.id;
            const serverxp = oresult["serverxp"];
            console.log(serverxp);
            const iguild = serverxp.map(function(e) { return e.sid; }).indexOf(message.guild.id);
            console.log(iguild);
            const oguild = serverxp[iguild];
            console.log(oguild);
            const oxp = oguild["xp"];
            console.log(oxp);
            const nxp = oxp + 1;
            console.log(nxp);
            const nsxp = serverxp.pop(iguild);
            const noserverxp = {sid: message.guild.id, xp: nxp};
            const nssxp = serverxp.push(noserverxp);
            const nserverxp = serverxp;
            const globalxp = oresult["globalxp"];
            ufilter = { uid: message.author.id }
            udoc = { $set: {
              		globalxp: (globalxp + 1),
                	serverxp: nserverxp
            	},
            };
            const od = await collection.updateOne(ufilter, udoc);
        } else {
            const sxp = {sid: message.guild.id, xp: 1};
            const doc = {
                    uid: message.author.id,
               		serverxp: [sxp],
                	globalxp: 1
            }
            const result = await collection.insertOne(doc);
        }
    }
}