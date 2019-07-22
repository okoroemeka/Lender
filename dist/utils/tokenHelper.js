"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const responseHelper_1 = require("../utils/responseHelper");
const { SECRETE_KEY } = process.env;
class Token {
    constructor() {
        this.createToken = (data, expiresIn, secreteKey) => {
            return jwt.sign(data, secreteKey, expiresIn);
        };
        this.verifyToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization || req.body.token;
                if (!token) {
                    return responseHelper_1.default(res, 403, 'Fail', 'No token was provided', false);
                }
                const userData = yield jwt.verify(token, SECRETE_KEY);
                console.log(userData);
                req.body.email = userData.email;
                return next();
            }
            catch (error) {
                return responseHelper_1.default(res, 500, 'Error', error.message, false);
            }
        });
    }
}
exports.default = new Token();
//# sourceMappingURL=tokenHelper.js.map