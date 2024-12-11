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
import Link from "next/link";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import Footer from "@/components/footer";
function App({ Component, pageProps, restaurantDetails, restaurantId }) {
  // console.log(restaurantId, "restaurantId123");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { locale } = router;
// console.log(locale,"localelocale");

  const [location, setLocation] = useState({ lat: 19.076, lng: 72.8777 });
  const [heroShown, setHeroShown] = useState(true);

  const [restaurantData, setRestaurantData] = useState({
    logo: "",
    description: "",
    cover_photo: "",
    name: "",
    address: "",
    facebook:"",
    twitter:"",
    tiktok:"",
    youtube:"",
    instagram:""
  });


  useEffect(() => {
    const loadRestaurantDetails = async () => {
      try {
        if (!restaurantDetails) {
          const host = window.location.hostname || "fuga";
          const subdomain = host.split(".")[0];

          const restaurantIdResponse = await axios.post(
            `https://api.hamilton-bites.online/backend/restaurant/get-restaurant-id`,
            { restaurant_subdomain: subdomain },
            { headers: { "Content-Type": "application/json","lang":locale } }
          );

          const newRestaurantId = restaurantIdResponse?.data?.payload?.restaurant_id;
          Cookies.set("restaurantId", newRestaurantId);

          const restaurantDetailsResponse = await axios.post(
            `https://api.hamilton-bites.online/backend/restaurant/get-restaurant-details-backend`,
            { restaurant_id: newRestaurantId },
            { headers: { "Content-Type": "application/json","lang":locale } }
          );

          const details = restaurantDetailsResponse?.data?.payload;
          console.log(details,"details");
          
          setRestaurantData({
            logo: details.logo || "",
            description:locale=="EN"? details.description?.EN:details.description?.AR || "",
            cover_photo: details.cover_photo || "",
            name: locale=="EN"?details.name?.EN:details.name?.AR || "",
            address: details.address || "",
            facebook:details.facebook || "",
            twitter:details.twitter || "",
            tiktok:details.tiktok || "",
            youtube:details.youtube || "",
            instagram:details.instagram || "",
          });

        } else {
          setRestaurantData({
            logo: restaurantDetails.logo || "",
            description: locale=="EN"?restaurantDetails.description?.EN :restaurantDetails.description?.AR|| "",
            cover_photo: restaurantDetails.cover_photo || "",
            name: locale=="EN"?restaurantDetails.name?.EN:restaurantDetails.name?.AR || "",
            address: restaurantDetails.address || "",
            facebook:restaurantDetails.facebook || "",
            twitter:restaurantDetails.twitter || "",
            tiktok:restaurantDetails.tiktok || "",
            youtube:restaurantDetails.youtube || "",
            instagram:restaurantDetails.instagram || ""
          });
          Cookies.set("restaurantId", restaurantId);
        }
       
      } catch (error) {
        console.error("Error loading restaurant details:", error);
      }
    };

    loadRestaurantDetails();
  }, [restaurantDetails]);

  useEffect(() => {
    Cookies.set("location", JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    Cookies.set("locale", locale);
  }, [locale]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Geolocation error:", error)
      );
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      // console.log("App is changing to:", url);
      setLoading(true);
    };

    const handleRouteComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteComplete);
    router.events.on("routeChangeError", handleRouteComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteComplete);
      router.events.off("routeChangeError", handleRouteComplete);
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
    const generateFingerprint = async () => {
      try {
        const components = await Fingerprint2.getPromise();
        const values = components.map((component) => component.value);
        const fingerprint = Fingerprint2.x64hash128(values.join(""), 31);
        Cookies.set("fingerprint", fingerprint);
      } catch (error) {
        console.error("Error generating fingerprint:", error);
      }
    };

    generateFingerprint();
  }, []);

  useEffect(() => {
    const handleResize = () => setHeroShown(window.innerWidth < 960);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Head>
        <title>Hamilton Bites</title>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} />
      </Head>
      <ThemeProvider>
        <div
          className="container-fluid"
          style={{
            backgroundImage: heroShown
              ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${restaurantData.cover_photo}')`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            style={{
              display: "flex",
              borderRadius: "20px",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <Loader />
            ) : (
              <div
                className="h-[calc(100vh-3rem)] w-full max-w-[40rem] custom-scroll flex flex-col"
                style={{ background: "#F4F5F5", overflowY: "scroll"}}
              >
                {showHero && router.pathname !== "/cart" && (
                  <div className="flex border p-4 rounded-lg shadow-sm relative">
                    <Avatar src={restaurantData.logo} alt="avatar" size="xl" />
                    <div className="ml-4">
                      <Typography variant="h6" className="text-sm md:text-lg">{restaurantData.name}</Typography>
                      <Typography className="text-gray-600 hidden md:flex">{restaurantData.description}</Typography>
                      <Typography className="text-gray-600">{restaurantData.address}</Typography>
                    </div>
                    <Link href="/cart" className="flex md:hidden absolute right-4 top-5 my-auto" >
                      <Typography
                        as="li"
                        variant="small"
                        color="blue-gray"
                        className="p-2 font-medium bg-white rounded-md"
                      >
                        <ShoppingBagIcon className="h-6 w-6 cursor-pointer" strokeWidth={2} />
                      </Typography>
                      </Link>
                  </div>
                )}

                <Component {...pageProps} />
              </div>
            )}
            {(showHero && !heroShown && restaurantDetails) && <Hero restaurantDetails={restaurantDetails} />}
          </div>
          <Footer
          facebook={restaurantData.facebook}
          twitter={restaurantData.twitter}
          tiktok={restaurantData.tiktok}
          youtube={restaurantData.youtube}
          instagram={restaurantData.instagram}
          />
        </div>
      </ThemeProvider>
    </>
  );
}

App.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  try {
    if (typeof window === "undefined") {
      const { req } = ctx;
      const host = req.headers.host || "fuga";
      const subdomain = host.split(".")[0];
      const locale = req.headers.cookie.split(";").filter(val=>val.includes("locale")).length>0?(req.headers.cookie.split(";").filter(val=>val.includes("locale"))[0].split("=")[1]=="ar"?"ar":"en"): "en";
      // console.log(locale,"locale");
      
      const restaurantIdResponse = await axios.post(
        `https://api.hamilton-bites.online/backend/restaurant/get-restaurant-id`,
        { restaurant_subdomain: subdomain },
        { headers: { "Content-Type": "application/json","lang":locale } }
      );

      const restaurantId = restaurantIdResponse?.data?.payload?.restaurant_id;

      const restaurantDetailsResponse = await axios.post(
        `https://api.hamilton-bites.online/backend/restaurant/get-restaurant-details-backend`,
        { restaurant_id: restaurantId },
        { headers: { "Content-Type": "application/json","lang":locale } }
      );

      const restaurantDetails = restaurantDetailsResponse?.data?.payload;

      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
      }

      return { pageProps, restaurantDetails, restaurantId };
    }
  } catch (error) {
    console.error("Error in getInitialProps:", error);
  }

  return { pageProps };
};

export default appWithTranslation(App);
