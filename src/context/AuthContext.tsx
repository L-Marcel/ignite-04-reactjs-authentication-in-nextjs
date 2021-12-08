import { ReactNode, useEffect, useState } from "react";
import { createContext } from "use-context-selector";
import { api } from "../services/api";
import Router from "next/router";
import { loadAuthToken, saveAuthToken } from "../services/token";
import { initAuthBroadcast } from "../services/broadcast/authCannel";

type AuthProviderProps = {
  children: ReactNode;
};

export const authContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    initAuthBroadcast();
    loadAuthToken(undefined, user => setUser(user));
  }, []);

  async function signIn(credentials: Credentials): Promise<void> { 
    try {
      const response = await api.post("sessions", credentials);
      const { token, refreshToken, permissions, roles } = response.data;

      saveAuthToken(undefined, token, refreshToken);

      setUser({
        email: credentials.email,
        permissions,
        roles
      });

      Router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <authContext.Provider
      value={{
        signIn,
        user,
        isAuthenticated
      }}
    >
      { children }
    </authContext.Provider>
  );
};