const express = require('express');
const {
  getAllTours,
  createTour,
  getTourById,
  updateTour,
  deleteTour,
  topFive,
  getTourStats,
  getMonthPlan,
} = require('../controllers/tourController');
const { protectAuth } = require('../controllers/authController');

const router = express.Router();

// alias middleware aggregate example (must be before getById '/:id'))
router.route('/top-five').get(topFive, getAllTours);

router.route('/tour-stats').get(getTourStats);

router.route('/month-plan/:year').get(getMonthPlan);

router.route('/').post().get(protectAuth, getAllTours).post(createTour);

router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
