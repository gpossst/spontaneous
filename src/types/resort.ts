export type Resort = {
  id?: number;
  resort_name: string;
  price: number | null;
  resort_id: number;
  date: string;
  created_at?: Date;
};

export type ResortResponse = {
  results: {
    date: string;
    price: string | number;
    resort_id: number;
    resort_name: string;
  }[];
  execution_time_seconds: number;
};
