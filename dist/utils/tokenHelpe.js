"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
// import {  } from "js";
exports.createToken = (data, expiresIn, secreteKey) => {
    return jwt.sign(data, secreteKey, { expiresIn });
};
//# sourceMappingURL=tokenHelpe.js.map