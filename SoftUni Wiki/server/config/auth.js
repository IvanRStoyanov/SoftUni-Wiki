module.exports = {
  isAuth: (req, res, next) => {
    if(req.isAuthenticated()) next();
      else return res.redirect('/user/login');
  },
  isInRole: (role) => {
    return (req, res, next) => {
        if (req.isAuthenticated() && req.user.roles.indexOf(role) > -1) {
            next()
        }
        else {
          res.redirect('/index');
        }
    }
  }
};