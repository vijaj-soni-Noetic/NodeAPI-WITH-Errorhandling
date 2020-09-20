const express = require('express');
const morgan = require('morgan');

const ApError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./router/tourRouter');
const AppError = require('./utils/appError');
const app =express();

if(process.env.NODE_EVN ==='development'){
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));



app.use((req, res, next) => {
    req.requestTime= new Date().toDateString();
    next();
});

app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next)=>{
    // res.status(404).json({
    //     status:" fails",
    //     message: `can't find ${req.originalUrl}`
    // });
    // const err = new Error(`can't find ${req.originalUrl}`);
    // err.status = 'fail';
    // err.statusCode = 404;

    // next(err);
    next(new AppError(`can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);
module.exports = app;