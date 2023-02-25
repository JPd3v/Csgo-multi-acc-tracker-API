import express from 'express';
const router = express.Router();
import * as usersController from '../controllers/usersController';

router.get('/auth/steam', usersController.steamLogIn);
router.get('/auth/steam/callback', usersController.steamLogInCallback);

export default router;
