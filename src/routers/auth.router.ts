import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { verifyTokenReturnId, checkRole } from '../middlewares/auth.middleware';
import { ERole, EToken } from '../types/account';

const router: Router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', AuthController.logout);
router.post('/refresh-token', verifyTokenReturnId(EToken.RefreshToken), AuthController.refreshToken);

router.get('/test', verifyTokenReturnId(EToken.AccessToken), (req, res) => {
  console.log('123');
  console.log(req.id);
  res.status(200).send({ id: req.id });
});

router.get('/check-role', verifyTokenReturnId(), checkRole(ERole.Owner), (req, res) => {
  res.status(200).send('Hello');
});

export default router;
