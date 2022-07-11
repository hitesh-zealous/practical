'use strict';

let userRoutes = require('./app/routes/user.routes');

module.exports = (app) => {
  app.use('/api/v1/user', userRoutes);
};

