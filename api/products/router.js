const router = require("express").Router();
const { protect, permit} = require('@middlewres/security');
const {
  createOne,
  getOne,
  getAll,
  deleteAll
} = require('./controller');

router.route('/')
  .post(protect, permit('admin'), createOne)
  .get(protect, permit('user', "admin"), getAll);

router.route('/:id')
  .get(protect, permit('user', 'admin'), getOne)
  .delete(protect, permit('admin'), deleteAll);

module.exports = router;