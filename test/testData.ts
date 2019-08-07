import * as bcrypt from 'bcryptjs';
const {
  ADMIN_MAIL,
  ADMIN_FIRSTNAME,
  ADMIN_LASTNAME,
  ADMIN_PASSWORD,
  ADMIN_ADDRESS,
  IS_ADMIN,
  TEST_EMAIL
} = process.env;
interface user {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  address: string;
}
interface testData {
  [key: string]: user;
}
export const testData: any = {
  signupUserSuccess: {
    lastName: 'nnaemeka',
    firstName: 'okoro',
    email: TEST_EMAIL,
    password: 'core0987',
    address: '1 aminu'
  },
  signupAdminUserSuccess: async () => ({
    lastName: ADMIN_LASTNAME,
    firstName: ADMIN_FIRSTNAME,
    email: ADMIN_MAIL,
    password: await bcrypt.hash(ADMIN_PASSWORD, 10),
    address: ADMIN_ADDRESS,
    isAdmin: IS_ADMIN
  }),
  signupExistingUser: {
    lastName: 'nnaemeka',
    firstName: 'okoro',
    email: TEST_EMAIL,
    password: 'core0987',
    address: '1 aminu'
  },
  signinUserSuccess: {
    email: TEST_EMAIL,
    password: 'core0987'
  },
  signinAdminUserSuccess: {
    email: ADMIN_MAIL,
    password: ADMIN_PASSWORD
  },
  signinNonUser: {
    email: 'marw056@gmail.com',
    password: 'wise2424'
  },
  signinUserWrongPassword: {
    email: TEST_EMAIL,
    password: 'ce0987'
  },
  loanData: {
    amount: 200,
    tenor: 3,
    token: ''
  },
  approveLoanData: {
    status: 'approved'
  },
  rejectLoanData: {
    status: 'rejected'
  },
  wrongStatusReaction: {
    status: 'dejected'
  },
  verifyUserData: {
    verificationStatus: 'verified'
  },
  verifyUserWithEmptyStatusData: {
    verificationStatus: ''
  },
  verifyUserWithWrongStatusData: {
    verificationStatus: 'verify'
  },
  loanRepaymentdata: {
    amount: 100
  },
  loanRepaymentAmountZero: {
    amount: 0
  },
  loanRepaymentOverPay: {
    amount: 5000
  },
  loanRepaymentTestData: {
    amount: 230
  },
  resetPassword: {
    email: TEST_EMAIL
  },
  resetPasswordWrongEmail: {
    email: 'emeka@yahoo.com'
  }
};
