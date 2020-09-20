const express = require('express');
const router  = express.Router();
const tourController = require('./../controller/tourController');

router
.route('/top-5-cheap')
.get(tourController.aliasTopTours, tourController.getAllTours);

router
.route('/tour-stats')
.get(tourController.getTourStats);

router
.route('/monthly-plan/:year')
.get(tourController.grtMonthlyPlan);


router
.route('/')
.get(tourController.getAllTours)
.post(tourController.Create)

router
.route('/:id')
.get(tourController.getTour)
.put(tourController.Update)
.delete(tourController.Delete)


module.exports = router;