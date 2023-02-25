import { COOKIES_OPTIONS } from './../utils/authenticate';
import { Request, Response } from 'express';
import passport from 'passport';

export const steamLogIn = passport.authenticate('steam');

export const steamLogInCallback = [
  passport.authenticate('steam', {
    failureRedirect: process.env.FRONT_END_URL,
    session: false,
  }),
  (req: Request, res: Response) => {
    res.cookie('refreshToken', req.user.refresh_token, COOKIES_OPTIONS);
    res.redirect(process.env.FRONT_END_URL);
  },
];
