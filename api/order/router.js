const router = require("express").Router();
const { protect, permit} = require('@middlewres/security');
const {
  createOne,
  getOne,
  getAll,
  updateOne,
  cancelOne,
  deleteOne
} = require('./controller');

router
  .route('/')
  .post(prpotect, createOne)
  .get(protect, getAll);
router
  .route('/:id')
  .get(protect, getOne)
  .put(protect, permit('admin'), updateOne)
  .delete(protect, permit('admin'), deleteOne);
router
  .route('/:id/cancel')
  .put(protect, cancelOne);


module.exports = router;