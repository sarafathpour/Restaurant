const router = require("express").Router();

router
  .use('/users', require('@api/users/router'))
  .use('/auth', require('@api/auth/router'))
  .use('/products', require('@api/products/router'))

module.exports = router;