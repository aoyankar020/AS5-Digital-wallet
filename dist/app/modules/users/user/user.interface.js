"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EISACTIVE = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["AGENT"] = "AGENT";
})(Role || (exports.Role = Role = {}));
var EISACTIVE;
(function (EISACTIVE) {
    EISACTIVE["ACTIVE"] = "ACTIVE";
    EISACTIVE["INACTIVE"] = "INACTIVE";
    EISACTIVE["BLOCKED"] = "BLOCKED";
})(EISACTIVE || (exports.EISACTIVE = EISACTIVE = {}));
