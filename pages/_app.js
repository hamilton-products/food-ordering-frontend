import "@/styles/globals.css";
import { ThemeProvider } from "@material-tailwind/react";
import Hero from "@/components/hero";
import Loader from "@/components/loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Fingerprint2 from "fingerprintjs2";
import Cookies from "js-cookie";
import Head from "next/head";
import { appWithTranslation } from "next-i18next";

function App({ Component, pageProps, restaurantDetails }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  console.log(restaurantDetails, "restaurantDetails");

  const { locale } = router;

  const [location, setLocation] = useState({ lat: 19.076, lng: 72.8777 });

  const [heroShown, setHeroShown] = useState(true);

  // set the user's location to the cookies when the location state changes
  Cookies.set("location", JSON.stringify(location));

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Function to detect full address using lat and long
  // const detectAddress = async () => {
  //   try {
  //     if (!location.lat || !location.lng) return;
  //     const response = await fetch(
  //       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&${process.env.GOOGLE_API_KEY}`
  //     );
  //     const data = await response.json();
  //     if (data.results.length > 0) {
  //       const area = data.results[0].formatted_address;
  //       setAddress({ ...address, area });
  //       Cookies.set("address", area);
  //     }
  //   } catch (error) {
  //     console.error("Error detecting address:", error);
  //   }
  // };

  // useEffect(() => {
  //   detectAddress();
  // }, []);

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

  const routesWithHero = [
    "/",
    "/product",
    "/cart",
    "/address",
    "/checkout",
    "/order",
    "/orders",
  ]; // replace with your actual routes

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 960) {
        setHeroShown(true);
      } else {
        setHeroShown(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Head>
        <title>Tasweeq</title>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        {/* <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDV3aChbZOKFp2kMd2Z-KCE_oeAzDVvlco&libraries=places"></script> */}
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} />
      </Head>
      <ThemeProvider>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {loading ? <Loader /> : <Component {...pageProps} />}

          {showHero && !heroShown && (
            <Hero restaurantDetails={restaurantDetails} />
          )}
        </div>
      </ThemeProvider>
    </>
  );
}

App.getInitialProps = async ({ Component, ctx }) => {
  const baseUrl = process.env.NEXT_PRODUCTION_BASE_URL;
  // Fetch data server-side using Axios
  try {
    const response = await axios.post(
      `${baseUrl}/backend/restaurant/get-restaurant-details-backend`,
      {
        restaurant_id: "RES1708493724LCA58967", // replace with your actual data
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response, "responsessss");
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

export default appWithTranslation(App);
