const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    discountPrice: Number,
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
function createSlug(next) {
  this.slug = slugify(this.name, { lower: true });
  // console.log('createSlug preSave', this);
  next();
}
tourSchema.pre('save', createSlug);

// function logInConsole(next) {
//   console.log('logInConsole preSave', this);
//   next();
// }
// tourSchema.pre('save', logInConsole);

// eslint-disable-next-line prefer-arrow-callback
// tourSchema.post('save', function (doc, next) {
//   doc.test = 'test';
//   console.log('prePost', this);
//   next();
// });

// QUERY MIDDLEWARE
// function hideSecretTours(next) {
//   this.find({ secretTour: { $ne: true } });
//   this.start = Date.now();
//   next();
// }
// tourSchema.pre(/^find/, hideSecretTours);

// // eslint-disable-next-line
// tourSchema.post(/^find/, function (doc, next) {
//   console.log(`Query took ${Date.now() - this.start} ms`);
//   next();
// });

// AGGREGATION MIDDLEWARE
function beforeAggregate(next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
  return 1;
}
tourSchema.pre('aggregate', beforeAggregate);

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
