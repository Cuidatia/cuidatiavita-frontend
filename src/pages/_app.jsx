import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
    useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
        console.log("Inicializando Clarity...");
        import('@microsoft/clarity')
        .then((clarity) => {
            clarity.default.start("rt6kuejhx5");
            console.log("Clarity iniciado");
        })
        .catch((err) => {
            console.error("Error cargando Clarity:", err);
        });
    } else {
        console.log("Clarity no se carga (no es producción o no está en navegador)");
    }
    }, []);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}


