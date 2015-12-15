var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();


// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/user', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/chat', isAuthenticated, function (req, res) {
    console.log("sending chat");
    // To Write a Cookie
    res.cookie("user", req.user.username);
    res.sendFile('chat.html', { root: './public'});
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/chat');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/chat');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;