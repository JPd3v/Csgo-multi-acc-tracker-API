import { SortOrder, Types } from 'mongoose';

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

interface ISteamAccount {
  user_id: string | Types.ObjectId;
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
  name: string;
  steam_account_id: string | Types.ObjectId;
  quality: string;
  price: number;
  creation_date: string;
}

export type { ItemsInfo, IUser, ISteamAccount, IPagination, Idrops };
