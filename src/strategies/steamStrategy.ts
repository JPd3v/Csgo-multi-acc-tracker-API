import passport from 'passport';
import { Strategy } from 'passport-steam';
import User from '../models/user';
import { getNewRefreshToken } from '../utils/authenticate';

passport.use(
  new Strategy(
    {
      returnURL: `${process.env.BACK_END_URL}/users/auth/steam/callback`,
      realm: process.env.BACK_END_URL,
      profile: false,
    },

    async (identifier: string, _profile, done) => {
      try {
        const userSteamId = identifier.split('/').at(-1);
        const foundUser = await User.findOne({ OAuth_id: identifier });

        if (!foundUser) {
          const newUser = await User.create({
            name: userSteamId,
            OAuth_id: userSteamId,
          });

          newUser.refresh_token = getNewRefreshToken({ _id: newUser._id });
          const savedUser = await newUser.save();

          return done(null, savedUser);
        }

        foundUser.refresh_token = getNewRefreshToken({ _id: foundUser._id });

        foundUser.save();
        return done(null, foundUser);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);
