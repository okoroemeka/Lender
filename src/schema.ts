import * as mongoose from 'mongoose';

const { TEST_DB, DEV_DB, PROD_DB, NODE_ENV } = process.env;

let uri: string = '';

if (NODE_ENV === 'dev') {
  uri = DEV_DB;
} else if (DEV_DB === 'test') {
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

const { Schema } = mongoose;
const loansSchema = new Schema({
  id: { type: String },
  user_email: { type: String }, // user email
  createdOn: { type: Date },
  status: { type: String }, // pending, approved, rejected
  repaid: { type: Boolean },
  tenor: { type: Number }, // maximum of 12 months
  amount: { type: Number },
  paymentInstallment: { type: Number }, // monthly installment payment(amount + interest) / tenor
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
  status: { type: String }, // unverified or verified
  isAdmin: { type: Boolean },
  loans: [{ type: Schema.Types.ObjectId, ref: 'Loan' }]
});

let Loan = mongoose.model('Loan', loansSchema);
let User = mongoose.model('User', userSchema);

export { Loan, User };
