import Can from "../components/can";
import useUser from "../hooks/useUser";
import { defaultAuth } from "../services/auth/default";
import { deleteAuthToken } from "../services/token";

export default function Dashboard() {
  const user = useUser();

  return (
    <div>
      <h1>Dashboard: {user?.email}</h1>
      <Can permissions={['metrics.list']}>
        <div>
          <h1>Metricas</h1>
        </div>
      </Can>
      <button onClick={deleteAuthToken}>Sign Out</button>
    </div>
  );
};

export const getServerSideProps = defaultAuth(async() => {
  return {
    props: {}
  };
});