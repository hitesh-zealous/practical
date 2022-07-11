'use strict';

module.exports = {

  /**
   * Responds client with JSON response
   */
  respondAsJSON: (res, message = '', data = {}, status = true, statusCode = 200) => {
    res.status(statusCode).json({
      status,
      statusCode,
      message,
      data
    });
  },

  /**
   * Handles error
   */
  handleError: (res, statusCode = 500, message = 'Internal server error', status = false, data = {}) => {
    message = message || 'Internal server error';

    res.status(statusCode).send({
      status,
      statusCode,
      message,
      data
    });
    return;
  },

  /*
  Pagination with filter and custom limit as well.
  */
  getPaginator: (req) => {
    let filter = {};
    filter.limit = process.env.DOCSLIMIT;
    if (req.query.hasOwnProperty('limit')) {
      if (req.query.limit === '-1') {
        req.query.limit = 5000000;
      }
      filter.limit = parseInt(req.query.limit);
    }
    filter.page = req.query.hasOwnProperty('page') ? Number(req.query.page) : 1;

    if (req.query.hasOwnProperty('sort')) {
      let arr = req.query.sort.split('-');
      filter.sort = {};
      if (arr.length === 2) {
        filter.sort[arr[1]] = -1;
      } else {
        filter.sort[arr[0]] = 1;
      }
    } else if (req.query.hasOwnProperty('sortBy')) {
      filter.sort = eval('(' + req.query.sortBy + ')');
    } else {
      filter.sort = { updatedAt: -1 };
    }

    filter.select = '-__v';
    return filter;
  },

}