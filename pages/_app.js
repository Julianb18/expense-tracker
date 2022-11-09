import { Navbar } from "../components/Navbar";
import { AuthUserProvider } from "../context/AuthContext";
import { UserDataProvider } from "../context/UserDataContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthUserProvider>
      <UserDataProvider>
        <Navbar />
        <Component {...pageProps} />
      </UserDataProvider>
    </AuthUserProvider>
  );
}

export default MyApp;
