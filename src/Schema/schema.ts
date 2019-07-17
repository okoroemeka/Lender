import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const { TEST_DB, DEV_DB, PROD_DB, NODE_ENV } = process.env;

let uri: string = '';

if (NODE_ENV === 'dev') {
  uri = DEV_DB;
} else if (NODE_ENV === 'test') {
  uri = TEST_DB;
} else {
  uri = PROD_DB;
}
mongoose.connect(uri, (error: any) => {
  if (error) console.log(error);
  else {
    console.log('successfully connected to mongodb');
  }
});

console.log(process.env.NODE_ENV);
const { Schema } = mongoose;
const loansSchema = new Schema({
  user_email: { type: String, required: true }, // user email
  createdOn: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'approved'],
    default: 'pending'
  }, // pending, approved, approved
  repaid: { type: Boolean, default: false },
  tenor: { type: Number, required: true }, // maximum of 12 months
  amount: { type: Number, required: true },
  paymentInstallment: { type: Number }, // monthly installment payment(amount + interest) / tenor
  balance: { type: Number },
  interest: { type: Number },
  _debtor: { type: Number, ref: 'User' }
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
  }, // unverified or verified
  isAdmin: { type: Boolean, default: false },
  loans: [{ type: Schema.Types.ObjectId, ref: 'Loan' }]
});

let Loan = mongoose.model('Loan', loansSchema);
let User = mongoose.model('User', userSchema);

export { Loan, User };
