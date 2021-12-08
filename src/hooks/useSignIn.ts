import { useContextSelector } from "use-context-selector";
import { authContext } from "../context/AuthContext";

export default function useSignIn() {
  return useContextSelector(authContext, (c) => c.signIn);
};