import express from 'express';
import * as usersController from '../controllers/usersController';

const router = express.Router();

router.get('/auth/steam', usersController.steamLogIn);
router.get('/auth/steam/callback', usersController.steamLogInCallback);

export default router;
