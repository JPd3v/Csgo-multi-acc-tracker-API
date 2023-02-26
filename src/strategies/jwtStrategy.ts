// var JwtStrategy = require('passport-jwt').Strategy,
import { Strategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import User from '../models/user';

interface IOptions {
  jwtFromRequest: (req: Express.Request) => string | null;
  secretOrKey: string;
}

const options: IOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

passport.use(
  new Strategy(options, async (jwt_payload, done) => {
    try {
      const foundUser = await User.findById({ id: jwt_payload._id });
      if (foundUser) {
        return done(null, foundUser);
      }

      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }),
);
