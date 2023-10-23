export interface IProduct {
  _id?: string;
  name?: string;
  image: {
    id: string;
    size: number;
    url: string;
    key: string;
  };
  price?: string;
  quantity: number;
  description?: string;
}

export interface ICategory {
  _id: string;
  name: string;
  image: { url: string; key: string };
  imageMin: string;
  __v: number;
}

export interface IUser {
  username: string;
  password: string;
}

export interface UserResponse {
  token: string;
  username: string;
}

export interface IValuesToUpdate {
  description: string | undefined;
  price: string | undefined;
  name: string | undefined;
}
