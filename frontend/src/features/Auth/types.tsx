export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type AuthStateValue = {
  accessToken: string | null;
  user: User | null;
};

export type AuthContextValue = AuthStateValue & {
  login: (value: AuthResponse) => void;
  logout: () => void;
};
