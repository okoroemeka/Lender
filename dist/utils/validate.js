"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=validate.js.map