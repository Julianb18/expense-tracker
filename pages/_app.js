import { Navbar } from "../components/Navbar";
import { AuthUserProvider } from "../context/AuthContext";
import { UserDataProvider } from "../context/UserDataContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthUserProvider>
      <UserDataProvider>
        <Navbar />
        <div className="min-h-[calc(100vh-55px)] bg-gradient-to-bl from-primaryDark via-secondaryDark to-primaryDark">
          <Component {...pageProps} />
        </div>
      </UserDataProvider>
    </AuthUserProvider>
  );
}

export default MyApp;
