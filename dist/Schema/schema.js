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
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
dotenv.config();
const { TEST_DB, DEV_DB, PROD_DB, NODE_ENV, ADMIN_MAIL, ADMIN_FIRSTNAME, ADMIN_LASTNAME, ADMIN_PASSWORD, ADMIN_ADDRESS, ADMIN_LOAN_STATUS, IS_ADMIN } = process.env;
let uri = '';
if (NODE_ENV === 'dev') {
    uri = DEV_DB;
}
else if (NODE_ENV === 'test') {
    uri = TEST_DB;
}
else {
    uri = PROD_DB;
}
mongoose.connect(uri, (error) => {
    if (error)
        console.log(error);
    else {
        console.log('successfully connected to mongodb');
    }
});
console.log(process.env.NODE_ENV);
const { Schema } = mongoose;
const loansSchema = new Schema({
    email: { type: String, ref: 'User', required: true },
    createdOn: { type: Date, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    repaid: { type: Boolean, default: false },
    tenor: { type: Number, required: true },
    amount: { type: Number, required: true },
    paymentInstallment: { type: Number },
    balance: { type: Number },
    interest: { type: Number }
    // _debtor: { type: Number, ref: 'User' }
});
const userSchema = new Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    status: {
        type: String,
        enum: ['Verified', 'Unverified'],
        default: 'Unverified'
    },
    isAdmin: { type: Boolean, default: false },
    loans: [{ type: Schema.Types.ObjectId, ref: 'Loan' }]
});
let Loan = mongoose.model('Loan', loansSchema);
exports.Loan = Loan;
let User = mongoose.model('User', userSchema);
exports.User = User;
const createAdmin = () => __awaiter(this, void 0, void 0, function* () {
    const user = yield User.findOne({ email: ADMIN_MAIL });
    if (!user) {
        yield User.create({
            email: ADMIN_MAIL,
            firstName: ADMIN_FIRSTNAME,
            lastName: ADMIN_LASTNAME,
            password: yield bcrypt.hash(ADMIN_PASSWORD, 10),
            address: ADMIN_ADDRESS,
            status: ADMIN_LOAN_STATUS,
            isAdmin: IS_ADMIN
        });
    }
});
createAdmin();
//# sourceMappingURL=schema.js.map