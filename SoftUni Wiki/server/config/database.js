const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
module.exports = (settings) => {
  mongoose.connect(settings.db);
  let db = mongoose.connection;
  db.once('open', err => {
    if(err) {
        console.log('fail to connect to DB');
        throw err;
    }
    console.log('MongoDB rdy')
  });
};