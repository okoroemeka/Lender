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
        this.createLoan = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenor, amount } = req.body;
                req.body.balance = amount;
                req.body.interest = 0.05 * amount;
                req.body.paymentInstallment = amount / tenor + req.body.interest;
                req.body.createdOn = new Date();
                const createLoan = yield schema_1.Loan.create(req.body);
                return responseHelper_1.default(res, 201, 'Success', createLoan, true);
            }
            catch (error) {
                return responseHelper_1.default(res, 500, 'Fail', error.message, false);
            }
        });
        this.Loan = schema_1.Loan;
    }
}
exports.default = new Loans();
//# sourceMappingURL=Loan.js.map