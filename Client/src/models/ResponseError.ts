export default class ResponseError extends Error {
    public readonly code: ResponseCode;

    constructor(message: string, code: ResponseCode) {
        super(message);
        this.code = code;
    }
}

export enum ResponseCode {
    BadRequest = 'BAD_REQUEST',
    Unauthorized = 'UNAUTHORIZED',
    Forbidden = 'FORBIDDEN',
    ServerError = 'SERVER_ERROR',
    ServiceUnavailable = 'SERVICE_UNAVAILABLE',
}