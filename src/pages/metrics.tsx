import decode from "jwt-decode";
import { defaultAuth } from "../services/auth/default";

export default function Metrics() {
  return (
    <div>
      <h1>Metrics</h1>
    </div>
  );
};

export const getServerSideProps = defaultAuth(async() => {
  return {
    props: {}
  };
}, {
  permissions: ['metrics.lis'],
  roles: ['administrator']
});