import { FormEvent, useState } from 'react';
import useSignIn from '../hooks/useSignIn';
import { guestAuth } from '../services/auth/guest';
import styles from '../styles/Home.module.scss';

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = useSignIn();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const data = {
      email,
      password
    };

    signIn(data);
  };

  return (
    <form className={`${styles.container} ${styles.main}`} onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)}/>
      <input type="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)}/>
      <button type="submit">Entrar</button>
    </form>
  );
};

export const getServerSideProps = guestAuth(async() => {
  return {
    props: {}
  };
});