import express from 'express';
import * as usersController from '../controllers/usersController';

const router = express.Router();

router.get('/auth/steam', usersController.steamLogIn);
router.get('/auth/steam/callback', usersController.steamLogInCallback);
router.get('/log-out', usersController.logOut);
router.get('/refresh-token', usersController.newRefreshToken);

export default router;
