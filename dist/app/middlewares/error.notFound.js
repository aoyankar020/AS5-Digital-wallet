"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.page_not_Found = void 0;
const page_not_Found = (req, res) => {
    res.send({
        status: false,
        code: 404,
        message: "Page Not Found",
    });
};
exports.page_not_Found = page_not_Found;
