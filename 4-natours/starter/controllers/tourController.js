const fs = require('fs');

const toursPath = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(toursPath, 'utf-8'));

exports.checkId = (req, res, next, val) => {
  const tour = tours.find((e) => e.id === +val);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  const checkKeyList = ['name', 'price', 'duration'];
  for (const key of Object.keys(req.body)) {
    checkKeyList.splice(checkKeyList.indexOf(key), 1)
  } 
  if (checkKeyList.length) {
    return res.status(400).json({
      status: 'fail',
      message: `Missing required properties: ${checkKeyList.join(', ')}`
    });
  }
  next();
};

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
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

exports.updateTour = (req, res) => {
  const tour = tours.find((e) => e.id === +req.params.id);
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
  const newTour = Object.assign({ id: newId }, req.body);
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
  tours.splice(tour.id, 1);
  fs.writeFile(toursPath, JSON.stringify(tours), (err) => {
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};
