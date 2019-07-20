"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const User_1 = require("../controller/User");
const validate_1 = require("../utils/validate");
const router = express.Router();
router.post('/auth/signup', validate_1.checkInputFields, User_1.default.userSignup);
router.post('/auth/signin', validate_1.checkInputFields, User_1.default.signin);
exports.default = router;
//# sourceMappingURL=Routes.js.map