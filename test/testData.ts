import * as bcrypt from 'bcryptjs';
const {
  ADMIN_MAIL,
  ADMIN_FIRSTNAME,
  ADMIN_LASTNAME,
  ADMIN_PASSWORD,
  ADMIN_ADDRESS,
  IS_ADMIN
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
    email: 'mekarw056@gmail.com',
    password: 'wise2424',
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
    email: 'mekarw056@gmail.com',
    password: 'wise2424',
    address: '1 aminu'
  },
  signinUserSuccess: {
    email: 'mekarw056@gmail.com',
    password: 'wise2424'
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
    email: 'mekarw056@gmail.com',
    password: 'wise224'
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
  }
};
