export type Loc = {
  address?: string;
  geo_longitude?: string; // numeric
  geo_latitude?: string; // numeric
  radius?: number;
};

export type Parameter = {
  name: string;
  value: string;
};

export type OfferGet = {
  offer_id: number;
  description: string;
  client_id: number;
  client_name: string;
  offer_type: string;
  flight_date?: Date; // as string
  deadline_date: Date; // as string
  location: Loc;
  location_id: number;
  format: string;
  parameters: Array<Parameter>;
  status: string;
};

export type OfferGet2 = Array<OfferGet>;

export type OfferPost = {
  description: string;
  offer_type: string;
  flight_date?: string;
  deadline_date: string;
  location: Loc;
  format: string;
  parameters?: Array<Parameter>;
  status?: string;
};

export type ReviewPost = {
  offer_id: number;
  rating?: number;
  review?: string;
};

export type Review = {
  offer_id: number;
  rating: number;
  review?: string;
  reviewer: string;
};

export type UserdataGet = {
  username: string;
  description: string;
  role: string;
  location: Loc;
  reviews: Array<Review>;
};

export type UserdataPost = {
  username?: string;
  description?: string;
  role?: string;
  location?: Loc;
};

export type Register = {
  username: string;
  email: string;
  password: string;
  re_password: string;
  phone_number: string;
};

export type Login = {
  email: string;
  password: string;
};

export type Token = {
  access_token: string;
};
