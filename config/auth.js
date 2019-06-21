module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Для просмотра этой страницы необходима авторизация!');
        res.redirect('/users/login');
    },
    forwardAuthenticated: (req, res, next) => {
        if(!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/home');
    }
};