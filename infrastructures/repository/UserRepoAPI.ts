import { IUserRepo } from "@/domains/repository/UserRepo";
import { UserType, LoginResponseType } from "@/domains/models/User";
import httpClient from "@/infrastructures/api/httpClients";
import { endpointUser } from "@/infrastructures/api/endpoints";

export const UserRepoAPI: IUserRepo = {
  async register(data): Promise<UserType> {
    try {
      const res = await httpClient.post(endpointUser.register, data);
      return res.data.user;
    } catch (err) {
      console.error("Erreur register:", err);
      throw err;
    }
  },

  async login(data): Promise<LoginResponseType> {
    try {
      const res = await httpClient.post(endpointUser.login, data);

      localStorage.setItem("rbac_token", res.data.token);

      return res.data;
    } catch (err) {
      console.error("Erreur login:", err);
      throw err;
    }
  },

  async getAll(): Promise<UserType[]> {
    try {
      const res = await httpClient.get(endpointUser.base, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("rbac_token")}`,
        },
      });
      return res.data;
    } catch (err) {
      console.error("Erreur getAllUsers:", err);
      throw err;
    }
  },

  async getById(id: string): Promise<UserType> {
    try {
      const res = await httpClient.get(endpointUser.byId(id), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("rbac_token")}`,
        },
      });
      return res.data;
    } catch (err) {
      console.error("Erreur getUserById:", err);
      throw err;
    }
  },

  async update(id: string, data: Partial<UserType>): Promise<UserType> {
    try {
      const res = await httpClient.put(endpointUser.byId(id), data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("rbac_token")}`,
        },
      });
      return res.data.user;
    } catch (err) {
      console.error("Erreur updateUser:", err);
      throw err;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await httpClient.delete(endpointUser.byId(id), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("rbac_token")}`,
        },
      });
    } catch (err) {
      console.error("Erreur deleteUser:", err);
      throw err;
    }
  },
};
