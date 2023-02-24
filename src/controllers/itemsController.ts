import { Request, Response } from 'express';
import Items from '../models/items';
import type { ItemsInfo } from '../types';

export const getItems = async (req: Request, res: Response) => {
  const itemName = req.query.itemName;
  const pageSize = req.query.pageSize as unknown as number;
  const curretPage = (req.query.curretPage as unknown as number) - 1 ?? 1;
  const skipPage = pageSize * curretPage;
  const queryLimit = pageSize ?? 10;

  const queryRegex = new RegExp(`${itemName}`, 'ig');

  const found = await Items.find({
    item_name: queryRegex,
  })
    .limit(queryLimit)
    .skip(skipPage);

  return res.status(200).json(found);
};
