import { useContextSelector } from "use-context-selector";
import { authContext } from "../context/AuthContext";

export default function useUser() {
  return useContextSelector(authContext, (c) => c.user);
};