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
const bcrypt = require("bcryptjs");
const schema_1 = require("../Schema/schema");
const responseHelper_1 = require("../utils/responseHelper");
const tokenHelper_1 = require("../utils/tokenHelper");
const { SECRETE_KEY } = process.env;
/**
 * User authentication
 */
class UserAuth {
    constructor() {
        this.signin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const response = yield schema_1.User.findOne({
                    email: new RegExp(`${email}`, 'gi')
                });
                if (!response) {
                    return responseHelper_1.default(res, 404, 'Fail', 'Email does not exist, please signup', false);
                }
                const { email: userEmail, password: userPassowrd } = response;
                if (!(yield bcrypt.compare(password, userPassowrd))) {
                    return responseHelper_1.default(res, 400, 'Fail', 'Wrong email or password', false);
                }
                return responseHelper_1.default(res, 200, 'Success', {
                    email: userEmail,
                    token: tokenHelper_1.default.createToken({ email }, { expiresIn: '1h' }, SECRETE_KEY)
                }, true);
            }
            catch (error) {
                return responseHelper_1.default(res, 500, 'Error', error.message, false);
            }
        });
        this.User = schema_1.User;
    }
    /**
     * Creates New User
     * @param req
     * @param res
     * @returns object
     */
    userSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const checkUser = yield schema_1.User.findOne({
                    email: new RegExp(`${email}`, 'gi')
                });
                if (checkUser) {
                    return responseHelper_1.default(res, 409, 'Fail', 'Email already exist', false);
                }
                let hashPassword = yield bcrypt.hash(password, 10);
                req.body.password = hashPassword;
                const { email: userEmail } = yield schema_1.User.create(req.body);
                const token = yield tokenHelper_1.default.createToken({ email }, { expiresIn: '1h' }, SECRETE_KEY);
                return responseHelper_1.default(res, 201, 'Success', { email: userEmail, token }, true);
            }
            catch (error) {
                return responseHelper_1.default(res, 500, 'Error', 'Internal serer error, please try again later', false);
            }
        });
    }
}
exports.default = new UserAuth();
//# sourceMappingURL=User.js.map