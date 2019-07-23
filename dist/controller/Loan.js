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
const schema_1 = require("../Schema/schema");
const responseHelper_1 = require("../utils/responseHelper");
class Loans {
    constructor() {
        /**
         * Loan application.
         * @param req
         * @param res
         * @returns object
         */
        this.createLoan = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenor, amount, userData: { email } } = req.body;
                req.body.balance = amount;
                req.body.email = email;
                req.body.interest = 0.05 * amount;
                req.body.paymentInstallment = amount / tenor + req.body.interest;
                req.body.createdOn = new Date();
                const createLoan = yield schema_1.Loan.create(req.body);
                return responseHelper_1.default(res, 201, 'Success', createLoan, true);
            }
            catch (error) {
                return responseHelper_1.default(res, 500, 'Error', error.message, false);
            }
        });
        /**
         * Get all loan application
         * @param req
         * @param res
         * @returns object
         */
        this.viewAllLoanApplication = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userData: { email, isAdmin } } = req.body;
                const loanApplications = yield schema_1.Loan.find(isAdmin ? {} : { email: new RegExp(`${email}`, 'gi') });
                const responsePackage = {
                    statusCode: loanApplications.length ? 200 : 404,
                    status: loanApplications.length ? 'Success' : 'Fail',
                    message: loanApplications.length
                        ? loanApplications
                        : `${isAdmin
                            ? 'No loan application was found'
                            : 'You have no loan application yet'}`,
                    responseType: loanApplications.length ? true : false
                };
                return responseHelper_1.default(res, responsePackage.statusCode, responsePackage.status, responsePackage.message, responsePackage.responseType);
            }
            catch (error) {
                return responseHelper_1.default(res, 500, 'Error', error.message, false);
            }
        });
        this.getSpecificLoan = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userData: { isAdmin } } = req.body;
                const { id } = req.params;
                if (!isAdmin) {
                    return responseHelper_1.default(res, 401, 'Error', 'You are not allowed to view this loan application.', false);
                }
                const loan = yield schema_1.Loan.findById(id);
                if (!loan) {
                    return responseHelper_1.default(res, 404, 'Error', 'loan not found', false);
                }
                return responseHelper_1.default(res, 200, 'Success', loan, true);
            }
            catch (error) {
                return responseHelper_1.default(res, 500, 'Error', 'Internal server error, Please try again later', false);
            }
        });
        this.Loan = schema_1.Loan;
    }
}
exports.default = new Loans();
//# sourceMappingURL=Loan.js.map