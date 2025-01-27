"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BACK_END_URL = exports.FRONT_END_URL = exports.Routes = exports.HttpStatusCodes = void 0;
exports.HttpStatusCodes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
exports.Routes = {
    REGISTER_USER: `/signup`,
    LOGIN: `/login`
};
exports.FRONT_END_URL = `http://localhost:3000`;
exports.BACK_END_URL = `http://localhost:8000`;
