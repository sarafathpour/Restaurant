const router = require("express").Router();
const { protect, permit } = require('@middlewares/security');
const {
  createOne,
  getOne,
  getAll,
  deleteOne
} = require('./controller');

router.route('/')
  .post(protect, permit('admin'), createOne)
  .get(getAll);

router.route('/all')

router.route('/:id')
  .get(getOne)
  .delete(protect, permit('admin'), deleteOne);

  module.exports = router;