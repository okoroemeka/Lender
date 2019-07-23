import * as express from 'express';
import User from '../controller/User';
import Loan from '../controller/Loan';
import { checkInputFields, checkLoanField } from '../utils/validate';
import Token from '../utils/tokenHelper';

const router = express.Router();

router.post('/auth/signup', checkInputFields, User.userSignup);
router.post('/auth/signin', checkInputFields, User.signin);
router.post('/loan', checkLoanField, Token.verifyToken, Loan.createLoan);
router.get('/loan', Token.verifyToken, Loan.viewAllLoanApplication);
router.get('/loan/:id', Token.verifyToken, Loan.getSpecificLoan);

export default router;
