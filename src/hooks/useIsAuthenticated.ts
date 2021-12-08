import { useContextSelector } from "use-context-selector";
import { authContext } from "../context/AuthContext";

export default function useIsAuthenticated() {
  return useContextSelector(authContext, (c) => c.isAuthenticated);
};