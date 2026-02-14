export interface responseAuth {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
}
