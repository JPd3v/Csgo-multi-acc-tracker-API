import { Request, Response } from 'express';
import { body, param, query } from 'express-validator';
import { verifyAuth } from '../utils/authenticate';
import validationErrors from '../middlewares/validationErrors';
import SteamAccounts from '../models/steamAccount';
import { IPagination, ISteamAccount } from '../types';

export const userAccounts = [
  verifyAuth,
  query('pageSize', 'pageSize is required')
    .isInt()
    .withMessage('pageSize should be an integer number'),
  query('page', 'page is required')
    .isInt()
    .withMessage('page should be an integer number'),
  validationErrors,
  async (req: Request<IPagination>, res: Response) => {
    const userId = req.user._id;
    const pageSize = req.params.pageSize;
    const currentPage = req.params.page - 1;
    const skipPage = pageSize * currentPage;

    try {
      const foundAccounts = await SteamAccounts.find({ user_id: userId })
        .skip(skipPage)
        .limit(pageSize);

      return res.status(200).json(foundAccounts);
    } catch (_error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
];

export const newAccount = [
  verifyAuth,
  body('name', 'name is required')
    .trim()
    .not()
    .isEmpty()
    .isLength({ max: 15 })
    .withMessage("name can't be longer than 15 characters")
    .escape(),
  body('steam_url', 'steam url must be an steam valid url')
    .trim()
    .isURL({ host_whitelist: ['steamcommunity.com'] })
    .optional(),
  validationErrors,
  async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      Pick<ISteamAccount, 'name' | 'steam_url'>
    >,
    res: Response,
  ) => {
    const userId = req.user._id;
    const accountName = req.body.name;
    const accountUrl = req.body.steam_url;

    try {
      const newSteamAccount = await SteamAccounts.create({
        name: accountName,
        steam_url: accountUrl,
        user_id: userId,
      });

      return res.status(201).json(newSteamAccount);
    } catch (_error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
];

export const editAccount = [
  verifyAuth,
  param('accountId', 'should provide a valid mongodbId ').isMongoId(),
  body('name')
    .trim()
    .isLength({ max: 15 })
    .withMessage("name can't be longer than 15 characters")
    .escape()
    .optional(),
  body('steam_url', 'steam url must be an steam valid url')
    .trim()
    .isURL({ host_whitelist: ['steamcommunity.com'] })
    .optional(),
  validationErrors,
  async (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      Pick<ISteamAccount, 'name' | 'steam_url'>
    >,
    res: Response,
  ) => {
    const { accountId } = req.params;
    const userId = req.user._id;
    const update = {
      name: req.body.name,
      steam_url: req.body.steam_url,
    };

    try {
      const updateAccount = await SteamAccounts.findOneAndUpdate(
        { _id: accountId, user_id: userId },
        update,
        { returnDocument: 'after' },
      );

      if (!updateAccount) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      return res.status(200).json(updateAccount);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
];

export const deleteAccount = [
  verifyAuth,
  param('accountId', 'should provide a valid mongodbId ').isMongoId(),
  validationErrors,
  async (req: Request, res: Response) => {
    const { accountId } = req.params;

    const userId = req.user._id;
    try {
      const deleteDocument = await SteamAccounts.findOneAndDelete({
        _id: accountId,
        user_id: userId,
      });

      if (!deleteDocument) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  },
];
