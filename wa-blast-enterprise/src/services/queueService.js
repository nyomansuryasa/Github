const Contact = require('../models/Contact');
const BlastQueue = require('../models/BlastQueue');

async function generateQueue() {
    const contacts = await Contact.findAll();
    for (let contact of contacts) {
        await BlastQueue.create({
            phone: contact.phone,
            message: contact.message
        });
    }
    console.log('✅ Queue generated from contact list');
}

module.exports = { generateQueue };
