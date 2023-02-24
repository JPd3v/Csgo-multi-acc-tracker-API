interface ItemsInfo {
  item_name: string;
  collection_name: string;
  item_data: [
    {
      quality?: string;
      price: number;
    },
  ];
}

export type { ItemsInfo };
