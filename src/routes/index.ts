import express, { Express, Request, Response } from 'express';
import { register, login } from '../controllers/auth'
import { verifyToken } from "../middleware/authorization";
import { getCacheUser, getUsersByQueryString} from '../controllers/user';
import { initChatRoom } from '../controllers/privateChatRoom';
// import authorization from './middleware/authorization';
const router = express.Router();

router.post('/auth/login', login);
router.post('/auth/register', register);

// router.post('/api/v1/auth/logout', auth.logout);
//
router.use(verifyToken);
router.get('/user/me', getCacheUser);
router.get('/users/find', getUsersByQueryString);

router.post('/chatRoom/add', initChatRoom);

// router.get('/api/v1/account/:accountId', accountController.getAccountById);
// router.get('/api/v1/myAccounts', accountController.getMyAccounts);
// router.post('/api/v1/account/deposit', transactionItemController.deposit);

export default router;