export const endpointUser = {
  base: "/users",
  register: "/users/register",
  login: "/users/login",
  byId: (id: string) => `/users/${id}`,
};
