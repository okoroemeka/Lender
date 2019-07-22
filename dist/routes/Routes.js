"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const User_1 = require("../controller/User");
const Loan_1 = require("../controller/Loan");
const validate_1 = require("../utils/validate");
const tokenHelper_1 = require("../utils/tokenHelper");
const router = express.Router();
router.post('/auth/signup', validate_1.checkInputFields, User_1.default.userSignup);
router.post('/auth/signin', validate_1.checkInputFields, User_1.default.signin);
router.post('/loan', validate_1.checkLoanField, tokenHelper_1.default.verifyToken, Loan_1.default.createLoan);
exports.default = router;
//# sourceMappingURL=Routes.js.map