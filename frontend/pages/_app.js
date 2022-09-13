import "../styles/globals.css";
import { Web3ContextProvider } from "../store/web3-context";
//My Components
import Layout from "../components/layout/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <Web3ContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3ContextProvider>
  );
}

export default MyApp;
