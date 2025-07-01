const sequelize = require('./config/database');
const Contact = require('./models/Contact');

sequelize.sync().then(() => {
  console.log('Database & tables created!');
});
