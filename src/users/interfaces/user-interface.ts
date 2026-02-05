export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
  createdAt: string;
}
