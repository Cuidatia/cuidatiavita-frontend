import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      import('@microsoft/clarity')
        .then((clarity) => {
          clarity.default.start('rt6kuejhx5');
        })
        .catch((err) => {
          console.error('Error cargando Microsoft Clarity:', err);
        });
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}


