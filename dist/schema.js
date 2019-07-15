"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const { TEST_DB, DEV_DB, PROD_DB, NODE_ENV } = process.env;
let uri = '';
if (NODE_ENV === 'dev') {
    uri = DEV_DB;
}
else if (DEV_DB === 'test') {
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
const { Schema } = mongoose;
const loansSchema = new Schema({
    id: { type: String },
    user_email: { type: String },
    createdOn: { type: Date },
    status: { type: String },
    repaid: { type: Boolean },
    tenor: { type: Number },
    amount: { type: Number },
    paymentInstallment: { type: Number },
    balance: { type: Number },
    interest: { type: Number },
    debtor: { type: Number, ref: 'User' }
});
const userSchema = new Schema({
    id: { type: String },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    address: { type: String },
    status: { type: String },
    isAdmin: { type: Boolean },
    loans: [{ type: Schema.Types.ObjectId, ref: 'Loan' }]
});
let Loan = mongoose.model('Loan', loansSchema);
exports.Loan = Loan;
let User = mongoose.model('User', userSchema);
exports.User = User;
//# sourceMappingURL=schema.js.map