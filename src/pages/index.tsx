import Head from 'next/head';

import CanvasBoard from '../components/CanvasBoard';
import styles from '../styles/Generic.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Dots animation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <CanvasBoard />
      </main>
    </div>
  );
};

export default Home;
