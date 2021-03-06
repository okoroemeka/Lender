import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

dotenv.config();

const {
  TEST_DB,
  DEV_DB,
  MONGODB_URI,
  NODE_ENV,
  ADMIN_MAIL,
  ADMIN_FIRSTNAME,
  ADMIN_LASTNAME,
  ADMIN_PASSWORD,
  ADMIN_ADDRESS,
  ADMIN_LOAN_STATUS,
  IS_ADMIN
} = process.env;

let uri: string = '';

if (NODE_ENV === 'dev') {
  uri = DEV_DB;
} else if (NODE_ENV === 'test') {
  uri = TEST_DB;
} else {
  uri = MONGODB_URI;
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
  email: { type: String, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  repaid: { type: Boolean, default: false },
  tenor: { type: Number, required: true },
  amount: { type: Number, required: true },
  monthlyInstallment: { type: Number },
  balance: { type: Number },
  interest: { type: Number },
  createdOn: { type: Date, required: true },
  dueDate: { type: Date, required: true }
});

const LoanRepaymentSchema = new Schema({
  loanId: { type: String, ref: 'Loan', required: true },
  paidAmount: { type: Number, required: true },
  monthlyInstallment: { type: Number },
  createdOn: { type: Date, required: true }
});
const userSchema = new Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: false },
  status: {
    type: String,
    enum: ['Verified', 'Unverified'],
    default: 'Unverified'
  },
  isAdmin: { type: Boolean, default: false },
  loans: [{ type: Schema.Types.ObjectId, ref: 'Loan' }],
  passwordResetToken: { type: String },
  isLoggedIn: { type: Boolean }
});

let Loan = mongoose.model('Loan', loansSchema);
let User = mongoose.model('User', userSchema);
let LoanRepayment = mongoose.model('LoanRepayMent', LoanRepaymentSchema);

const createAdmin = async () => {
  // await Loan.deleteMany({}, error => console.log(error));
  // await User.deleteMany({}, error => console.log(error));
  const user = await User.findOne({ email: ADMIN_MAIL });
  if (!user) {
    await User.create({
      email: ADMIN_MAIL,
      firstName: ADMIN_FIRSTNAME,
      lastName: ADMIN_LASTNAME,
      password: await bcrypt.hash(ADMIN_PASSWORD, 10),
      address: ADMIN_ADDRESS,
      status: ADMIN_LOAN_STATUS,
      isAdmin: IS_ADMIN
    });
  }
};
createAdmin();
export { Loan, User, LoanRepayment };
