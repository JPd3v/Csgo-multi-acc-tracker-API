import { Request, Response } from 'express';
import { body, param, query } from 'express-validator';
import { Types } from 'mongoose';
import { verifyAuth } from '../utils/authenticate';
import Drops from '../models/drop';
import validationErrors from '../middlewares/validationErrors';
import { Idrops, IPagination } from '../types';
import SteamAccount from '../models/steamAccount';

export const getDrops = [
  verifyAuth,
  query('pageSize', 'pageSize is required')
    .isInt()
    .withMessage('pageSize should be an integer number'),
  query('page', 'page is required')
    .isInt()
    .withMessage('page should be an integer number'),
  param('steamAccountId', 'should provide a valid mongodbId ').isMongoId(),
  validationErrors,
  async (req: Request<{ steamAccountId: string }>, res: Response) => {
    const { sort, sortBy, pageSize, page } =
      req.query as unknown as IPagination;
    const { steamAccountId } = req.params;
    const currentPage = page - 1;
    const skipPage = pageSize * currentPage;
    const mongoSort = { [sortBy]: sort };

    try {
      const drops = await Drops.find({ steam_account_id: steamAccountId })
        .limit(pageSize)
        .skip(skipPage)
        .sort(mongoSort);
      return res.status(200).json(drops);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
];

export const newDrop = [
  verifyAuth,
  body('name', ' name is required')
    .notEmpty()
    .trim()
    .isLength({ max: 40 })
    .withMessage('name max length is 40')
    .escape(),
  body('quality')
    .trim()
    .isLength({ max: 30 })
    .withMessage('quality max length is 30')
    .escape()
    .optional(),
  body('price', 'price is required')
    .notEmpty()
    .trim()
    .isNumeric()
    .withMessage('price should be a number')
    .isFloat({ min: 0 })
    .withMessage('price cannot be a negative number')
    .escape(),
  body('steam_account_id', 'steam account id is required')
    .trim()
    .isMongoId()
    .withMessage('should be a mongoId'),
  validationErrors,
  async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      Omit<Idrops, 'creation_date'>
    >,
    res: Response,
  ) => {
    const { name, price, quality, steam_account_id } = req.body;
    const userId = req.user._id;

    try {
      const drop = await Drops.create({
        name,
        price,
        steam_account_id,
        quality,
        user_id: userId,
      });

      return res.status(201).json(drop);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
];

export const editDrop = [
  verifyAuth,
  body('name', ' name is required')
    .notEmpty()
    .trim()
    .isLength({ max: 40 })
    .withMessage('name max length is 40')
    .escape()
    .optional(),
  body('quality')
    .trim()
    .isLength({ max: 30 })
    .withMessage('quality max length is 30')
    .escape()
    .optional(),
  body('price')
    .notEmpty()
    .trim()
    .isNumeric()
    .withMessage('price should be a number')
    .isFloat({ min: 0 })
    .withMessage('price cannot be a negative number')
    .escape()
    .optional(),
  param('dropId', 'steam account id is required').trim().isMongoId(),
  validationErrors,
  async (
    req: Request<
      { dropId: Types.ObjectId },
      Record<string, never>,
      Record<string, never>,
      Omit<Idrops, 'creation_date'>,
      Omit<Idrops, 'creation_date'>
    >,
    res: Response,
  ) => {
    const { dropId } = req.params;
    const { name, price, quality } = req.body;
    const userId = req.user._id;
    const update: Omit<
      Idrops,
      'creation_date' | 'user_id' | 'steam_account_id' | '_id'
    > = {
      name,
      price,
      quality,
    };
    try {
      const drop = await Drops.findOneAndUpdate(
        { _id: dropId, user_id: userId },
        update,
        {
          runValidators: true,
        },
      );

      if (!drop) {
        return res.status(404).json({ message: 'Unauthorized' });
      }

      if (price) {
        await SteamAccount.findByIdAndUpdate(drop.steam_account_id, {
          $inc: { money_revenue: update.price - drop.price },
        });
      }

      // const dropsTotalPrice: Aggregate<Pick<ISteamAccount, 'money_revenue'>>[] =
      //   await Drops.aggregate([
      //     {
      //       $match: {
      //         steam_account_id: drop.steam_account_id,
      //         user_id: new Types.ObjectId(userId),
      //       },
      //     },
      //     {
      //       $group: {
      //         _id: null,
      //         money_revenue: { $sum: '$price' },
      //       },
      //     },
      //     {
      //       $project: {
      //         _id: 0,
      //         money_revenue: '$money_revenue',
      //       },
      //     },
      //   ]);

      // console.log((await dropsTotalPrice[0]).money_revenue);
      // const accountTotalRevenue = (await dropsTotalPrice[0]).money_revenue;

      // await SteamAccount.findByIdAndUpdate(
      //   drop.steam_account_id,
      //   {
      //     money_revenue: accountTotalRevenue,
      //   },
      //   { runValidators: true },
      // );

      return res.status(201).json({ message: 'drop edited successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
];

export const deleteDrop = [
  verifyAuth,
  param('dropId').trim().isMongoId(),
  validationErrors,
  async (
    req: Request<
      { dropId: Types.ObjectId },
      Record<string, never>,
      Record<string, never>,
      Omit<Idrops, 'creation_date'>
    >,
    res: Response,
  ) => {
    const userId = req.user._id;
    const { dropId } = req.params;

    try {
      const drop = await Drops.findOneAndDelete({
        _id: dropId,
        user_id: userId,
      });

      if (!drop) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      await SteamAccount.findByIdAndUpdate(drop.steam_account_id, {
        $inc: { money_revenue: -drop.price },
      });

      return res.status(200).json({ message: 'drop deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
];
