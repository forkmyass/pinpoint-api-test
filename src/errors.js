
class NotFound extends Error {
    constructor(path) {
        super(path);
        this.code = 404;
        this.path = path;
        Error.captureStackTrace(this);
    }
}

class Forbidden extends Error {
    constructor(path) {
        super(path);
        this.code = 403;
        this.path = path;
        Error.captureStackTrace(this);
    }
}

class Unauthorized extends Error {
    constructor(msg) {
        super(msg);
        this.message = msg || 'Unauthorized';
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

export default {NotFound, Forbidden, Unauthorized, BadRequest}
