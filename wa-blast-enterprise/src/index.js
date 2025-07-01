const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const sequelize = require('./config/database');
const Contact = require('./models/contact');
const { startWhatsApp } = require('./services/waClient');
const { startBlast } = require('./services/blastWorker');
const dashboardRoute = require('./routes/dashboard');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, '../public')));
app.use('/dashboard', dashboardRoute);

sequelize.sync().then(async () => {
  console.log('Database ready.');

  const sessions = ['session-01', 'session-02'];

  sessions.forEach(async (session) => {
    const client = startWhatsApp(session, io);
    client.on('ready', () => {
      startBlast(client, session);
    });
  });
});

server.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
