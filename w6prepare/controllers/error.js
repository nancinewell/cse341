exports.get404 = (req, res, next) => {
  res.status(404).render('404', { 
    pageTitle: 'Page Not Found', 
    path: '/404',
    isAuthenticated: req.session.isLoggedIn });
};

exports.get500 = (req, res, next) => {
  res.status(500).render('500', { 
    pageTitle: 'Error', 
    path: '/500',
    isAuthenticated: req.session.isLoggedIn });
};

/*
status codes
200's  = success
  200 = Operation Succeeded (DEFAULT)
  201 = Success, resource created

300's = redirect
  301 = Moved Permanently

400's = client-side error
  401 = Not Authenticated
  403 = Not authorized
  404 = Not Found
  422 = Invalid Input

500's = server-side error
  500 = Server side error

*/