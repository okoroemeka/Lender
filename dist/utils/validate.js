"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHelper_1 = require("../utils/responseHelper");
/**
 * Validates user inputs.
 * @param req
 * @param res
 * @param next
 */
exports.checkInputFields = (req, res, next) => {
    const userInput = req.body;
    // const data = Object.keys(userInput);
    const emptyFields = [];
    const fieldRequired = req.path === '/auth/signup'
        ? ['lastName', 'firstName', 'email', 'password', 'address']
        : ['email', 'password'];
    fieldRequired.forEach(field => {
        if (!userInput[field] || !userInput[field].trim().length) {
            emptyFields.push(field);
        }
    });
    if (emptyFields.length) {
        return res.status(402).json({
            status: 'Fail',
            message: `The ${emptyFields.length > 1
                ? `${emptyFields.slice(0, emptyFields.length - 1).join()} and ${emptyFields[emptyFields.length - 1]}`
                : emptyFields.join()} field${emptyFields.length > 1 ? 's' : ''} ${emptyFields.length > 1 ? 'are' : 'is'} required.`
        });
    }
    return next();
};
exports.checkLoanField = (req, res, next) => {
    const { tenor, amount } = req.body;
    if (!tenor || isNaN(tenor)) {
        return responseHelper_1.default(res, 400, 'Fail', 'The tenor field is required and must be a number', false);
    }
    if (tenor < 1 || tenor > 12) {
        return responseHelper_1.default(res, 400, 'Fail', 'tenor must be a number between 1 and 12', false);
    }
    if (!amount || isNaN(amount) || amount < 0) {
        return responseHelper_1.default(res, 400, 'Fail', 'The amount field is required and must be a number greater than 0', false);
    }
    return next();
};
//# sourceMappingURL=validate.js.map