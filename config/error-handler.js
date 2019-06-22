module.exports = {
    flashError: function (req, res, err) {
        req.flash('error_msg', 'Произошла ошибка при регистрации аккаунта, пожалуйста, обратитесь в тех. поддержку. Ошибка: ' + err);
        res.redirect('/users/login');
    }
};