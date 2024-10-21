export type UserModel = {
  id?: string | number;
  name: string;
  username: string;
  password: string;
};

export type User = {
  id?: string | number;
  username: string;
  name: string;
};

export type AuthenticationData = {
  username?: string;
  password?: string;
  token?: string;
};
