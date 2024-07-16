import "@/styles/globals.css";
import { ThemeProvider } from "@material-tailwind/react";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Loader from "@/components/loader";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Fingerprint2 from "fingerprintjs2";
import Cookies from "js-cookie";
import Head from "next/head";
import { appWithTranslation } from "next-i18next";
import cookie from "cookie";

function App({ Component, pageProps, restaurantDetails, restaurantId }) {
  console.log(restaurantId, "restaurantId123");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { locale } = router;

  const [location, setLocation] = useState({ lat: 19.076, lng: 72.8777 });
  const [heroShown, setHeroShown] = useState(true);

  // Set the user's location to the cookies when the location state changes
  Cookies.set("location", JSON.stringify(location));

  useEffect(() => {
    if (restaurantId) {
      Cookies.set("restaurantId", restaurantId);
    }
  }, []);

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
    "/delivery",
  ]; // replace with your actual routes

  const showHero = routesWithHero.includes(router.pathname);

  useEffect(() => {
    async function generateFingerprint() {
      try {
        const components = await Fingerprint2.getPromise();
        const values = components.map((component) => component.value);
        const fingerprint = Fingerprint2.x64hash128(values.join(""), 31);
        Cookies.set("fingerprint", fingerprint);
      } catch (error) {
        console.error("Error generating fingerprint:", error);
      }
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const { req } = ctx;

    const restaurantCookiesId = req.cookies.restaurantId;

    console.log(restaurantCookiesId, "restaurantCookiesId");
    console.log(req.headers, "req.headers");

    const host = req.headers.host;
    const subdomain = host.split(".")[0];
    // const subdomain = "altamash";

    console.log(baseUrl, "baseUrl");

    console.log(subdomain, "subdomain");

    const restaurantIdResponse = await axios.post(
      `https://apitasweeq.hamiltonkw.com/backend/restaurant/get-restaurant-id`,
      {
        restaurant_subdomain: subdomain,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(restaurantIdResponse, "restaurantIdResponse");

    const restaurantId =
      restaurantIdResponse.data &&
      restaurantIdResponse.data.payload &&
      restaurantIdResponse.data.payload.restaurant_id;

    console.log(restaurantId, "restaurantId");

    // set restaurantId in the cookies

    // if (restaurantId) {
    //   context.res.setHeader(
    //     "Set-Cookie",
    //     cookie.serialize("restaurantId", restaurantId, {
    //       path: "/",
    //       // maxAge: 60 * 60 * 24, // 1 day
    //     })
    //   );
    // }

    const restaurantDetailsResponse = await axios.post(
      `https://apitasweeq.hamiltonkw.com/backend/restaurant/get-restaurant-details-backend`,
      {
        restaurant_id: restaurantId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const restaurantDetails =
      restaurantDetailsResponse.data && restaurantDetailsResponse.data.payload;

    return { pageProps, restaurantDetails, restaurantId };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { pageProps: {} };
  }
};

export default appWithTranslation(App);
