import * as express from 'express';
import User from '../controller/User';
import { checkInputFields } from '../utils/validate';

const router = express.Router();

router.post('/auth/signup', checkInputFields, User.userSignup);
router.post('/auth/signin', checkInputFields, User.signin);

export default router;
