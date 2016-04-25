module.exports=function(){

    this.error=function (err, req, res, next) {
        var status = err.status || 500;

        if(err.name=('HttpError'||'AuthError')){
            return next(err);
        }

        if (process.env.NODE_ENV === 'production') {
            res.status(status).send({error: err.message});
        } else {
            res.status(status).send({error: err.message + '\n' + err.stack});
        }
    }
};


