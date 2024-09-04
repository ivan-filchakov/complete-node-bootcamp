const express = require('express');
const {
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
  topFive,
  getTourStats,
  // checkId,
} = require('../controllers/tourController');

const router = express.Router();

// router.param('id', checkId);

// alias middleware example (must be before getById '/:id'))
router.route('/top-five').get(topFive, getAllTours);

router.route('/tour-stats').get(getTourStats);

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
