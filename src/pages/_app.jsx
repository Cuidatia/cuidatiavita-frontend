import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import Clarity from '@microsoft/clarity';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            Clarity.init("rt6kuejhx5");
        }
    }, []);

    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}

