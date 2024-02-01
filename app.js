/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

require('dotenv').config();

let path = require('path');
let express = require('express');
let session = require('express-session');
let createError = require('http-errors');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require('cors');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let authRouter = require('./routes/auth');
let pdfRouter = require('./routes/pdf');
let pdfMulterRouter = require('./routes/pdfMulter');
let connectToDb = require('./db');

// initialize express
let app = express();

/**
 * Using express-session middleware for persistent user session. Be sure to
 * familiarize yourself with available options. Visit: https://www.npmjs.com/package/express-session
 */
 app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // set this to true on production
    }
}));

// connect to database
connectToDb();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/pdf', pdfRouter);
app.use('/pdfMulter', pdfMulterRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;