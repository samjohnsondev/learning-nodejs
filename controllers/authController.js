const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');

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

    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; //1 hour
    await user.save();

    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    req.flash('success', `You have been emailed details to reset ${resetURL}`);

    res.redirect('/login');
};