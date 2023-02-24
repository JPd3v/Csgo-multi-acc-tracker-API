import { Request, Response } from 'express';
import Items from '../models/items';
import casesScrapper from '../webScrapers/casesScrapper';

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

export const updateCases = async (_req: Request, res: Response) => {
  try {
    const cases = await casesScrapper();

    cases.map(async (element) => {
      await Items.findOneAndUpdate({ item_name: element.item_name }, element, {
        upsert: true,
      });
    });

    return res.status(200).json({ message: 'items updated succefully' });
  } catch (error) {
    res.status(500).json({ message: 'somethin went wrong' });
  }
};
