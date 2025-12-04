import { IUserRepo } from "@/domains/repository/UserRepo";
import { UserType, LoginResponseType } from "@/domains/models/User";
import httpClient from "@/infrastructures/api/httpClients";
import { endpointUser } from "@/infrastructures/api/endpoints";
import { saveUser } from "@/lib/auth";
import { decodeToken } from "@/hooks/useDecodeToken";

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

      if (!res.data.user) {
        console.error("❌ No user in response!");
        throw new Error("Réponse invalide du serveur: pas d'utilisateur");
      }
      
      if (!res.data.token) {
        console.error("❌ No token in response!");
        throw new Error("Réponse invalide du serveur: pas de token");
      }
      let userId = res.data.user._id || res.data.user.id;
      
      if (!userId) {

        const decoded = decodeToken(res.data.token);
        if (decoded?.id) {
          userId = decoded.id;

        } else {
          console.error("❌ Cannot extract ID from token!");
        }
      }
      
      const userWithId = {
        ...res.data.user,
        _id: userId,
      };
      
      saveUser(userWithId, res.data.token);
      
      return {
        ...res.data,
        user: userWithId,
      };
    } catch (err) {
      console.error("❌ Erreur login:", err);
      throw err;
    }
  },

  async getAll(): Promise<UserType[]> {
    try {
      const res = await httpClient.get(endpointUser.base);
      return res.data;
    } catch (err) {
      console.error("Erreur getAllUsers:", err);
      throw err;
    }
  },

  async getById(id: string): Promise<UserType> {
    try {
      
      if (!id || id === "") {
        throw new Error("ID utilisateur invalide ou vide");
      }
      
      const res = await httpClient.get(endpointUser.byId(id));
      return res.data;
    } catch (err) {
      console.error("Erreur getUserById:", err);
      throw err;
    }
  },

  async update(id: string, data: Partial<UserType>): Promise<UserType> {
    try {
      const res = await httpClient.put(endpointUser.byId(id), data);
      return res.data.user;
    } catch (err) {
      console.error("Erreur updateUser:", err);
      throw err;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await httpClient.delete(endpointUser.byId(id));
    } catch (err) {
      console.error("Erreur deleteUser:", err);
      throw err;
    }
  },
};