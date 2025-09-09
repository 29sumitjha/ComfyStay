class ExpresssError extends Error{
    constructor(statusCode ,messagae){
        super();
        this.statusCode = statusCode;
        this.message = messagae;
    }
};
module.exports = ExpresssError;