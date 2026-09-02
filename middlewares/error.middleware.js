const errorMidleware = (err, req, res, next) => {
    try {
        let error = { ...error };

        error.message = err.message;

        console.error(error);

        // mongoose bad objectid
        if(err.name === 'CastError') {
            const message = "Resource not found";
            error = new Error(message);
            error.statusCode = 404;
        }

        // mongoose duplicate key
        if(err.name === 'ValidationError') {
            const message = "Duplicate value entered";
            error = new Error(message);
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({success: false, error: error.message || 'Server Error'});
    }catch(err) {
        next(err);
    }
}



export default errorMidleware;