"use strict";

getError404 = function getError404(req, res, next) {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found'
  });
};

module.exports = getError404;