
export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};


export interface IAuthUser extends Pick<User, 'id' | 'email' > {
    roles: string[];
}