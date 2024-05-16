import Head from "next/head";

import { Navbar } from "../components/Navbar";

import { AuthUserProvider } from "../context/AuthContext";
import { UserDataProvider } from "../context/UserDataContext";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Budget Tracker</title>

        <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
        <link rel="icon" type="image/png" href="/assets/favicon.png" />
      </Head>
      <AuthUserProvider>
        <UserDataProvider>
          <Navbar />
          <div className="min-h-[calc(100vh-55px)] overflow-y-none bg-gradient-to-bl from-primaryDark via-secondaryDark to-primaryDark">
            <Component {...pageProps} />
          </div>
        </UserDataProvider>
      </AuthUserProvider>
    </>
  );
}

export default MyApp;
