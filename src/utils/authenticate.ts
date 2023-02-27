import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';
import { Types } from 'mongoose';
import passport from 'passport';

const isSecure = process.env.IS_HTTP_SECURE as unknown as boolean;

export const COOKIES_OPTIONS: CookieOptions = {
  secure: isSecure,
  httpOnly: true,
  signed: true,
  maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
  sameSite: 'none',
};

interface ITokenSignature {
  _id: string | Types.ObjectId;
}

export function getNewAccessToken({ _id }: ITokenSignature) {
  return jwt.sign(_id, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
}

export function getNewRefreshToken(_id: ITokenSignature) {
  return jwt.sign(_id, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
  });
}

export const verifyAuth = passport.authenticate('jwt', { session: false });
