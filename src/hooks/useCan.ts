import { validatePermissions } from "../services/auth/validatePermissions";
import useIsAuthenticated from "./useIsAuthenticated";
import useUser from "./useUser";

type UseCanParams = {
  roles?: string[];
  permissions?: string[];
};

export default function useCan({ permissions, roles }: UseCanParams) {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  
  if(!isAuthenticated) {
    return false;
  };

  return validatePermissions(user, permissions, roles);
};