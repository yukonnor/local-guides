const { DatabaseError } = require("pg");

/** Error extensions */
class AppError extends Error {
    constructor(message = "App Error", status = 500) {
        super();
        this.message = message;
        this.status = status;
    }
}

class NotFoundError extends AppError {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}

class BadRequestError extends AppError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}

function returnValidationError(errors) {
    const errorMessages = errors.map((err) => err.message);
    return new Response(JSON.stringify({ errors: errorMessages }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
    });
}

module.exports = {
    AppError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    DatabaseError,
    returnValidationError,
};
