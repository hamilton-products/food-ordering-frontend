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
import { Avatar, Typography } from "@material-tailwind/react";
function App({ Component, pageProps, restaurantDetails, restaurantId }) {
  console.log(restaurantId, "restaurantId123");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const [locale, setLocale] = useState("ar");

  const { locale } = router;

  const [location, setLocation] = useState({ lat: 19.076, lng: 72.8777 });
  const [heroShown, setHeroShown] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      Cookies.set("restaurantId", restaurantId);
    }
  }, [restaurantId]);

  useEffect(() => {
    Cookies.set("location", JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    Cookies.set("locale", JSON.stringify(locale));
  }, [locale]);

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
    "/privacy-policy",
    "/product",
    "/cart",
    "/address",
    "/checkout",
    "/order",
    "/orders",
    "/delivery",
    "/tables",
  ];

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

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logo = restaurantDetails.logo || "";
  const description =
    restaurantDetails.description && restaurantDetails.description.EN;
    const cover_photo = restaurantDetails?.cover_photo || "";
  const name = restaurantDetails.name && restaurantDetails.name.EN;

  const address = restaurantDetails.address;

  return (
    <>
      <Head>
        <title>Tasweeq</title>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} />
      </Head>
      <ThemeProvider>
        <div className="container-fluid"  style={{
            backgroundImage: heroShown ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${cover_photo}')` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundBlendMode: "multiply",
          }}>

        <div style={{
            display: "flex",
            borderRadius:"20",
            justifyContent: "center"
          }}     
        >
          {loading ? (
            <Loader />
          ) : (
            <div
              className="h-[calc(100vh)] flex flex-col"
              style={{
                background: "#F4F5F5",
              }}
            >
              { showHero && <div className="flex max-w-full sm:max-w-[30rem] sm:min-w-[30rem] md:max-w-[40rem] md:min-w-[40rem] lg:max-w-[40rem] lg:min-w-[40rem] border p-4 rounded-lg shadow-sm">
                <div className="mr-4">
                  <Avatar src={logo} alt="avatar" size="xl" />
                </div>

                <div className="grid">
                  <Typography
                    variant="h6"
                    color="dark"
                    className="font-semibold text-lg"
                  >
                    {name}
                  </Typography>

                  <Typography
                    variant="body1"
                    color="dark"
                    className="text-gray-600"
                  >
                    {description}
                  </Typography>

                  <Typography
                    variant="body1"
                    color="dark"
                    className="text-gray-600"
                  >
                    {address}
                  </Typography>

                  <div className="flex items-center gap-2 mt-2">
                    {/* Add icons for payment methods or other information here */}
                    <span className="text-green-600">
                      {" "}
                      {/* Example of payment icon */}
                      <i className="fas fa-credit-card"></i>
                    </span>
                    <span className="text-green-600">
                      {" "}
                      {/* Example of cash icon */}
                      <i className="fas fa-money-bill"></i>
                    </span>
                  </div>
                </div>
              </div>}
              

              <Component {...pageProps} />
            </div>
          )}

          {showHero && !heroShown && (
            <Hero restaurantDetails={restaurantDetails} />
          )}
        </div>
        </div>
      </ThemeProvider>
    </>
  );
}

App.getInitialProps = async ({ Component, ctx }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  let pageProps = {};

  try {
    if (typeof window === "undefined") {
      const { req } = ctx;
      const host = req.headers.host || "fuga";
      const subdomain = host.split(".")[0];
      // const subdomain = "fuga"; // Hardcoded subdomain for now

      console.log(baseUrl, "baseUrl");
      console.log(subdomain, "subdomain");

      const restaurantIdResponse = await axios.post(
        `https://apitasweeq.hamiltonkw.com/backend/restaurant/get-restaurant-id`,
        { restaurant_subdomain: subdomain },
        { headers: { "Content-Type": "application/json" } }
      );

      const restaurantId = restaurantIdResponse?.data?.payload?.restaurant_id;

      console.log(restaurantId, "restaurantId");

      const restaurantDetailsResponse = await axios.post(
        `https://apitasweeq.hamiltonkw.com/backend/restaurant/get-restaurant-details-backend`,
        { restaurant_id: restaurantId },
        { headers: { "Content-Type": "application/json" } }
      );

      const restaurantDetails = restaurantDetailsResponse?.data?.payload;

      console.log(restaurantDetails, "restaurantDetails");

      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
      }

      return { pageProps, restaurantDetails, restaurantId };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // Always return pageProps even if error occurs
  return { pageProps };
};

export default appWithTranslation(App);
