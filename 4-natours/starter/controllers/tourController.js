const fs = require('fs');

const toursPath = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(toursPath, 'utf-8'));

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTourById = (req, res) => {
  const tour = tours.find((e) => e.id === +req.params.id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
    });
  }
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

exports.updateTour = (req, res) => {
  const tour = tours.find((e) => e.id === +req.params.id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
    });
  }
  const patchedTour = Object.assign(tour, ...req.body);
  tours.splice(tour.id, 1, patchedTour);
  fs.writeFile(toursPath, JSON.stringify(tours), (err) => {
    res.status(200).json({
      status: 'success',
      data: { tour: patchedTour },
    });
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, ...req.body);
  tours.push(newTour);
  fs.writeFile(toursPath, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
};

exports.deleteTour = (req, res) => {
  const tour = tours.find((e) => e.id === +req.params.id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
    });
  }
  tours.splice(tour.id, 1);
  fs.writeFile(toursPath, JSON.stringify(tours), (err) => {
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};