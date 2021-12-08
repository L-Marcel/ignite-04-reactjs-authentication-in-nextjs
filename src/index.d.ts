declare interface Credentials {
  email: string;
  password: string;
};

declare type User = {
  email: string;
  permissions: string[];
  roles: strings[];
};

declare type AuthContextData = {
  signIn(credentials: Credentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
};