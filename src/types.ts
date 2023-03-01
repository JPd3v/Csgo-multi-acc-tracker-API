import { SortOrder, Types } from 'mongoose';

interface ItemsInfo {
  _id?: Types.ObjectId;
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
  _id: Types.ObjectId;
  name: string;
  refresh_token?: string;
  OAuth_id: string;
}

interface ISteamAccount {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  name: string;
  steam_url?: string;
  money_revenue: number;
}

interface IPagination {
  pageSize: number;
  page: number;
  sortBy?: string;
  sort?: SortOrder;
}

interface Idrops {
  _id: Types.ObjectId;
  name: string;
  user_id: Types.ObjectId;
  steam_account_id: Types.ObjectId;
  quality: string;
  price: number;
  creation_date: string;
}

export type { ItemsInfo, IUser, ISteamAccount, IPagination, Idrops };
