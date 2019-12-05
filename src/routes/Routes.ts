import * as express from 'express';
import User from '../controller/User';
import Loan from '../controller/Loan';
import PendingLoan from '../controller/PendingLoan';
import ResetPassword from '../controller/ResetPassword';
import ApprovedLoan from '../controller/approvedLoan';
import {
  checkInputFields,
  checkLoanField,
  checkPasswordFields,
  validateEditProfile
} from '../utils/validate';
import Token from '../utils/tokenHelper';
import Profile from '../controller/Profile';
import clearCach from '../middlewares/clearCach';
const router = express.Router();

router.post('/auth/signup', checkInputFields, clearCach, User.userSignup);
router.post('/auth/signin', checkInputFields, clearCach, User.signin);
router.get('/auth/user', Token.verifyToken, User.getUser);
router.post('/loans', checkLoanField, Token.verifyToken, Loan.createLoan);
router.post('/loans/:loanId/repayment', Token.verifyToken, Loan.loanRepayment);
router.get(
  '/loans/:loanId/repayments',
  Token.verifyToken,
  Loan.loanRepaymentHistory
);
router.get('/loans', Token.verifyToken, Loan.viewAllLoanApplication);
router.get('/loans/:id', Token.verifyToken, Loan.getSpecificLoan);
router.patch('/loans/:id', Token.verifyToken, Loan.reactToLoanApplication);
router.patch('/users/:user_email/verify', Token.verifyToken, User.verifyUser);
router.post('/reset-password', ResetPassword.sendResetLink);
router.patch(
  '/reset-password/:token',
  Token.verifyResetPasswordToken,
  checkPasswordFields,
  ResetPassword.updatePassword
);
router.patch(
  '/edit-profile',
  Token.verifyToken,
  validateEditProfile,
  Profile.profileUpdate
);
router.get('/edit-profile', Token.verifyToken, Profile.viewProfile);
router.get('/pending-loan', Token.verifyToken, PendingLoan.getPendingRequest);
router.get(
  '/approved&unpaid',
  Token.verifyToken,
  ApprovedLoan.approvedButUnpaidLoan
);

export default router;
