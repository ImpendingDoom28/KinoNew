module.exports = {
    checkIsLogged: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Для просмотра этой страницы необходима авторизация!');
        res.redirect('/users/login');
    },
    checkIsNotLogged: (req, res, next) => {
        if(!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/home');
    }
};