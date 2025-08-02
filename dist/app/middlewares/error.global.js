"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalError = void 0;
const env_config_1 = require("../config/env.config");
const error_helper_1 = require("../helper/error.helper");
const GlobalError = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    let statuscode = 500;
    let message = "Global Error :";
    if (err instanceof error_helper_1.AppError) {
        statuscode = err.code;
        message = err.message;
    }
    res.send({
        statuscode: statuscode,
        status: false,
        message: `${message} ${err === null || err === void 0 ? void 0 : err.message}`,
        Error: err,
        stack: env_config_1.ENV.NODE_ENV === "development" ? err.stack : null,
    });
};
exports.GlobalError = GlobalError;
