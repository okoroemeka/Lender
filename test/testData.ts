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
export const testData = {
  signupUserSuccess: {
    lastName: 'nnaemeka',
    firstName: 'okoro',
    email: 'mekarw056@gmail.com',
    password: 'wise2424',
    address: '1 aminu'
  },
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
  signinNonUser: {
    email: 'marw056@gmail.com',
    password: 'wise2424'
  },
  signinUserWrongPassword: {
    email: 'mekarw056@gmail.com',
    password: 'wise224'
  }
};
