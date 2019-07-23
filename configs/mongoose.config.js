const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://cluster0-dl7ek.mongodb.net/test?retryWrites=true&w=majority', {
  user: 'test', // todo to .env
  pass: 'testtest', // todo to .env
  useNewUrlParser: true
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('debug', true);

mongoose.connection.on('connected', () => {
  console.log('mongo connected');
});

mongoose.connection.on('error', err => {
  console.log(err);
});

mongoose.connection.on('disconnected', () => {
  console.log('mongodb connection closed');
});

process.on('SIGINT', () => {
  mongoose.connection.close( () => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

