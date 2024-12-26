export type EnrichedPrice = {
  id: number;
  price: number;
  resort_id: number;
  date: Date;
  resort_name: string;
  location: {
    lat: number;
    lng: number;
  };
  state: string;
  links: string;
  region: string;
};
