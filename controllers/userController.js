const mongoose = require('mongoose');

exports.loginForm = (req, res) => {
    res.render('login', {title: 'Login Form'});
}

exports.registerForm = (req, res) => {
    res.render('register', {title: 'Register'})
}

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail().notEmpty();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extention: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password-confirm', 'Password is required').notEmpty();
    req.checkBody('password-confirm', 'Your passwords do not match').equals(req.body.password);

    const Errors = req.validationErrors();
    if(Errors){
        req.flash('error', Errors.map(err => err.msg));
    }

    res.render('resgister', {title: 'Register', body: req.body, flashes: req.flash()})
}