/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  console.log('========= UNHANDLED REJECTION =========');
  // server.close(() => {
  //   process.exit(1);
  // });
});

process.on('uncaughtException', (err) => {
  console.error(err.name, err.message);
  console.log('========= UNCAUGHT EXCEPTION =========');
});

const DB = process.env.DATABASE.replace(
  // const DB = process.env.DATABASE_LOCAL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then(() => {
  console.log('DB connection successfull');
});

const port = +process.env.PORT;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${port}...`);
});

// SCHEMA => MODEL EXAMPLE
// const toursSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'A tour must have a name'],
//     unique: true,
//   },
//   rating: {
//     type: Number,
//     default: 4.5,
//   },
//   price: {
//     type: Number,
//     required: [true, 'A tour must have a price'],
//   },
// });

// const Tour = mongoose.model('Tour', toursSchema);

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 997,
// });
// testTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log(err.message));
