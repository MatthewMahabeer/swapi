import '../styles/globals.css';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'jotai';

function MyApp({ Component, pageProps }) {

  const client = new QueryClient();

  return (
    <Provider>
    <QueryClientProvider client={client}>
      <Component {...pageProps} />
      <ReactQueryDevtools />
    </QueryClientProvider>
    </Provider>
  );
}

export default MyApp
