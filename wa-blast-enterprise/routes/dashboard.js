const express = require('express');
const router = express.Router();
const { Contact } = require('../models/contact');

router.get('/', async (req, res) => {
  const sessions = await Contact.findAll({
    attributes: ['sessionName'],
    group: ['sessionName']
  });

  const data = {};

  for (const session of sessions) {
    const name = session.sessionName;
    const total = await Contact.count({ where: { sessionName: name } });
    const sent = await Contact.count({ where: { sessionName: name, status: 'sent' } });
    const failed = await Contact.count({ where: { sessionName: name, status: 'failed' } });
    const pending = await Contact.count({ where: { sessionName: name, status: 'pending' } });

    data[name] = { total, sent, failed, pending };
  }

  res.json(data);
});

module.exports = router;
