import * as express from 'express';
import User from '../controller/User';
import { checkInputFields } from '../utils/validate';

const router = express.Router();

router.post('/auth/signup', checkInputFields, User.userSignup);

export default router;
