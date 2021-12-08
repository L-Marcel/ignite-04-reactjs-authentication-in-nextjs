import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";
import decode from "jwt-decode";
import { AuthTokenError } from "../errors/AuthTokenError";
import { deleteAuthToken } from "../token";
import { validatePermissions } from "./validatePermissions";

type DefaultAuthOptions = {
  permissions?: string[];
  roles?: string[];
};

export function defaultAuth<P>(fn: GetServerSideProps<P>, options?: DefaultAuthOptions) {
  return async(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(context);
    const token = cookies["nextauth.token"];

    if(!token) {
      return {
        redirect: {
          destination: "/",
          permanent: false
        }
      };
    };

    if(options) {
      const user = decode<User>(token);
      const validateUserPermissions = validatePermissions(user, options.permissions, options.roles);

      if(!validateUserPermissions) {
        return {
          redirect: {
            destination: "/",
            permanent: false
          },
        };
      };
    };

    try {
      return await fn(context);
    } catch (error) {
      if(error instanceof AuthTokenError) {
        deleteAuthToken(context);

        return {
          redirect: {
            destination: "/",
            permanent: false,
          }
        };
      };
    }
  };
};