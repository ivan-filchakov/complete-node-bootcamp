const Tour = require('../models/tourModel');
const BaseService = require('../services/baseService');
const catchAsync = require('../common/catch-async');
const AppError = require('../common/app-error');

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  const service = new BaseService(Tour.find(), req.query)
    .filter()
    .sort()
    .select()
    .paginate();
  const tours = await service.query;
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.topFive = catchAsync(async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
});

exports.getTourById = catchAsync(async (req, res /*, next */) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    throw new AppError({
      message: 'tour not found',
      statusCode: 404,
    });
  }
  // ERROR ALTERNATIVE  CALL
  // return next(
  //   new AppError({
  //     message: 'tour not found',
  //     statusCode: 404,
  //   }),
  // );
  // }
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedTour) {
    throw new AppError({
      message: 'tour not found',
      statusCode: 404,
    });
  }
  res.status(200).json({
    status: 'success',
    data: { tour: updatedTour },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const target = await Tour.findByIdAndDelete(req.params.id);
  if (!target) {
    throw new AppError({
      message: 'tour not found',
      statusCode: 404,
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingAverage: { $gte: 0 },
      },
    },
    {
      $group: {
        // _id: null,
        // _id: '$difficulty',
        _id: { $toUpper: '$difficulty' },
        count: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   // AND...
    //   $match: {
    //     _id: { $ne: 'EASY' },
    //   },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    groupCount: stats.length,
    data: stats,
  });
});

exports.getMonthPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const conditions = [
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        count: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
    // {
    //   $limit: 1,
    // },
  ];
  const plan = await Tour.aggregate(conditions);
  res.status(200).json({
    status: 'success',
    dataCount: plan.length,
    data: plan,
  });
});
