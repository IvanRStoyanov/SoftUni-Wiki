const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const Article = require('../models/Article');

module.exports = (app) => {
    app.engine('.hbs', handlebars({
        extname: '.hbs',
        layoutsDir: 'views/layout',
        defaultLayout: 'main'
    }));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(session({
        secret: 'Da Vinci Code',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req, res, next) => {
        if(req.user){
            res.locals.currentUser = req.user;
        }
        Article.find({}).then(articles => {
            if(articles.length > 0) {
                res.locals.lastId = articles.pop()._id;
            }
            next();
        });
    });

    app.set('view engine', '.hbs');
    app.use(express.static(path.join(__dirname, '../../public')));
    console.log('Express Rdy');
};