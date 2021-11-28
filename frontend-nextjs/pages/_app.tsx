import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "antd";
import { AppHeader } from "../components/AppHeader";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout id="app">
      <AppHeader />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
