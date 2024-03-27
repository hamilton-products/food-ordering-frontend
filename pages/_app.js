import "@/styles/globals.css";

import { ThemeProvider } from "@material-tailwind/react";
import Hero from "@/components/hero";
import Loader from "@/components/loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Fingerprint2 from "fingerprintjs2";
import Cookies from "js-cookie";

function App({ Component, pageProps, restaurantDetails }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
    };
    const handleComplete = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const routesWithHero = ["/", "/product", "/cart"]; // replace with your actual routes

  const showHero = routesWithHero.includes(router.pathname);

  // Generate a unique fingerprint for the user
  useEffect(() => {
    async function generateFingerprint() {
      const components = await Fingerprint2.getPromise();
      const values = components.map((component) => component.value);
      const fingerprint = Fingerprint2.x64hash128(values.join(""), 31);
      Cookies.set("fingerprint", fingerprint);
    }

    generateFingerprint();
  }, []);

  return (
    <ThemeProvider>
      <div style={{ display: "flex" }}>
        {loading ? <Loader /> : <Component {...pageProps} />}
        {showHero && <Hero restaurantDetails={restaurantDetails} />}
      </div>
    </ThemeProvider>
  );
}

App.getInitialProps = async ({ Component, ctx }) => {
  // Fetch data server-side using Axios
  try {
    const response = await axios.post(
      "https://api.talabatsweets.com/backend/restaurant/get-restaurant-details-backend",
      {
        restaurant_id: "RES1708493724LCA58967", // replace with your actual data
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const restaurantDetails = response.data && response.data.payload;

    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, restaurantDetails };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { pageProps: {} }; // Return an empty object if there's an error
  }
};

export default App;
