import { Types } from 'mongoose';

interface ItemsInfo {
  item_name: string;
  collection_name: string;
  item_data: [
    {
      steam_url: string;
      quality?: string;
      price: number;
    },
  ];
}

interface IUser {
  _id: string | Types.ObjectId;
  name: string;
  refresh_token?: string;
  OAuth_id: string;
}

export type { ItemsInfo, IUser };
