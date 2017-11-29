const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash:  'Failed Login',
    successRedirect: '/',
    successFlash: 'You are now logged in'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You have successfully logged out');
    res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
        return;
    }
    req.flash('error', 'You need to be logged in');
    res.redirect('/login');
}

exports.forgot = async (req, res) => {
    //See if the user exists
    const user = await User.findOne({email: req.body.email});
    
    //If there is no user direct them to the login page
    if(!user){
        req.flash('error', 'Email not found...');
        return res.redirect('/login');
    }
}