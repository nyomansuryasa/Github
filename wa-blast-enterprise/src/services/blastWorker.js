const Contact = require('../models/contact');

async function startBlast(client, sessionName) {
    console.log(`🚀 Memulai blasting untuk ${sessionName}`);
    while (true) {
        const contact = await Contact.findOne({ where: { status: 'pending', sessionName } });
        if (!contact) {
            await new Promise(res => setTimeout(res, 5000));
            continue;
        }

        try {
            const chat = await client.getChatById(contact.number + "@c.us");
            await client.sendMessage(chat.id._serialized, contact.message);
            contact.status = 'sent';
            await contact.save();
            console.log(`✅ Sent ke ${contact.number}`);
        } catch (err) {
            contact.status = 'failed';
            await contact.save();
            console.error(`❌ Failed ke ${contact.number}:`, err.message);
        }
    }
}

module.exports = { startBlast };
