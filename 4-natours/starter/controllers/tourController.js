// const mongoose = require('mongoose');
const Tour = require('../models/tourModel');

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllTours = (req, res) => {
  // res.status(200).json({
  //   status: 'success',
  //   requestTime: req.requestTime,
  //   results: tours.length,
  //   data: {
  //     tours,
  //   },
  // });
};

exports.getTourById = (req, res) => {
  // const tour = tours.find((e) => e.id === +req.params.id);
  // res.status(200).json({
  //   status: 'success',
  //   data: { tour },
  // });
};

exports.updateTour = (req, res) => {
  // const tour = tours.find((e) => e.id === +req.params.id);
  // const patchedTour = Object.assign(tour, ...req.body);
  // tours.splice(tour.id, 1, patchedTour);
  // fs.writeFile(toursPath, JSON.stringify(tours), () => {
  //   res.status(200).json({
  //     status: 'success',
  //     data: { tour: patchedTour },
  //   });
  // });
};

exports.deleteTour = (req, res) => {
  // const tour = tours.find((e) => e.id === +req.params.id);
  // tours.splice(tour.id, 1);
  // fs.writeFile(toursPath, JSON.stringify(tours), () => {
  //   res.status(204).json({
  //     status: 'success',
  //     data: null,
  //   });
  // });
};
