
class NotFound extends Error {
    constructor(body) {
        super(body);
        this.code = 404;
        this.body = body;
        Error.captureStackTrace(this);
    }
}

class Forbidden extends Error {
    constructor(body) {
        super(body);
        this.code = 403;
        this.body = body;
        Error.captureStackTrace(this);
    }
}

class Unauthorized extends Error {
    constructor(body) {
        super(body);
        this.body = body || 'Unauthorized';
        this.code = 401;
        Error.captureStackTrace(this);
    }
}

class BadRequest extends Error {
    constructor(body) {
        super(body);
        this.message = 'Bad request';
        this.body = body;
        this.code = 400;
        Error.captureStackTrace(this);
    }
}

class ServerError extends Error {
    constructor(body) {
        super(body);
        this.code = 500;
        this.body = body;
        Error.captureStackTrace(this);
    }
}


export default {NotFound, Forbidden, Unauthorized, BadRequest, ServerError}
