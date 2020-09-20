const AppError = require("./../utils/appError");

const handleCastErrorDB = err =>{
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

const handleDuplicateFieldDB = err =>{
    
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Dulicate field ${value}`;
    return new AppError(message, 400);
}

const handleValidationErrordDB = err =>{
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid inut data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) =>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) =>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else{
        res.status(500).json({
            status: "error",
            message:"something went wrong!"
        });
    }
}


module.exports = (err, req, res, next) => {
    console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'
    if(process.env.NODE_ENV === 'development'){
    sendErrorDev(err, res);
    }
    else if(process.env.NODE_ENV === 'production'){
        let error = {...err };

        if(error.name === 'castError') error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateFieldDB(error);
        if(error.name === 'validationError') error = handleValidationErrordDB(error);
        sendErrorProd(error, res);
    }
}