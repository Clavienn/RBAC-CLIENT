import { UserType, LoginResponseType } from "@/domains/models/User";

export interface IUserRepo {
  register(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<UserType>;

  login(data: { email: string; password: string }): Promise<LoginResponseType>;

  getAll(): Promise<UserType[]>;

  getById(id: string): Promise<UserType>;

  update(id: string, data: Partial<UserType>): Promise<UserType>;

  delete(id: string): Promise<void>;
}
