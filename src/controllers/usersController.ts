import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import passport from 'passport';
import type { IUser } from '../types';
import {
  COOKIES_OPTIONS,
  getNewAccessToken,
  getNewRefreshToken,
  verifyAuth,
} from '../utils/authenticate';
import Users from '../models/user';

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

export const logOut = [
  verifyAuth,
  async (req: Request, res: Response) => {
    try {
      await Users.findByIdAndUpdate(req.user._id, { refresh_token: '' });

      res.clearCookie('refreshToken', COOKIES_OPTIONS);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: 'something went wrong' });
    }
  },
];

export async function newRefreshToken(req: Request, res: Response) {
  const { refreshToken } = req.signedCookies;
  if (!refreshToken) {
    return res.status(401).json({ message: 'unauthorized' });
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
    ) as IUser;

    const newAccessToken = getNewAccessToken({ _id: payload._id });
    const newToken = getNewRefreshToken({ _id: payload._id });

    const foundUser = await Users.findById(payload._id);
    foundUser.refresh_token = newToken;

    await foundUser.save();

    res.cookie('refreshToken', foundUser.refresh_token, COOKIES_OPTIONS);
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(500).json({ message: 'something went wrong' });
  }
}

export const currentUserInfo = [
  verifyAuth,
  async (req: Request, res: Response) => {
    const user = req.user;

    return res.status(200).json(user);
  },
];
