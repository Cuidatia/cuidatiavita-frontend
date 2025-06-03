import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { clarity } from 'clarity-js';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            clarity.init("rt6kuejhx5");
        }
    }, []);

    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}

