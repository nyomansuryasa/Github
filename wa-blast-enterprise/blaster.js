const { Contact } = require('./models/contact');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => Math.floor(Math.random() * 6000) + 2000; // 2s-8s

async function startBlast(client, sessionName) {
  console.log(`🚀 Memulai blasting untuk ${sessionName}`);

  while (true) {
    const contact = await Contact.findOne({ where: { status: 'pending', sessionName } });

    if (!contact) {
      await delay(2000);
      continue;
    }

    try {
      const chatId = `${contact.number}@c.us`;
      await client.sendMessage(chatId, contact.message);
      await contact.update({ status: 'sent' });
      console.log(`✅ Sent ke ${contact.number}`);
    } catch (e) {
      console.error(`❌ Failed ke ${contact.number}: ${e.message}`);
      await contact.update({ status: 'failed' });
    }

    await delay(randomDelay());
  }
}

module.exports = { startBlast };
