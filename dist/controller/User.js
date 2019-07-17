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
const jwt = require("jsonwebtoken");
const schema_1 = require("../Schema/schema");
/**
 * User authentication
 */
class UserAuth {
    constructor() {
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
                const { SECRETE_KEY } = process.env;
                const checkUser = yield schema_1.User.findOne({
                    email: new RegExp(`${email}`, 'gi')
                });
                if (checkUser) {
                    return res.status(409).json({
                        status: 'Fail',
                        message: 'Email already exist'
                    });
                }
                let hashPassword = yield bcrypt.hash(password, 10);
                req.body.password = hashPassword;
                const { email: userEmail } = yield schema_1.User.create(req.body);
                const token = jwt.sign({ data: email }, SECRETE_KEY, { expiresIn: '1h' });
                return res.status(200).json({
                    status: 'Success',
                    email: userEmail,
                    token
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: 'Error',
                    mesasage: 'Internal serer error, please try again later'
                });
            }
        });
    }
}
exports.default = new UserAuth();
//# sourceMappingURL=User.js.map