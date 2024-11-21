import axios from "axios";
import Products from "@/components/products";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import cookie from "cookie";

const MainPage = ({ menu, cartDetails, restaurantDetails }) => {
  return (
    <>
      <Products
        menu={menu}
        cartDetails={cartDetails}
        restaurantDetails={restaurantDetails}
      />
    </>
  );
};

export async function getServerSideProps(context) {
  const baseUrl = process.env.NEXT_PRODUCTION_BASE_URL;
  // const restaurantId = context.req.cookies.restaurantId;
  // Get tableId from query parameters
  const { tableId } = context.query;
  console.log(tableId, "tableId");

  console.log(context, "restaurantId+++++++");
  const host = context.req.headers.host || "fuga";

  console.log(host, "host++");
  const subdomain = host.split(".")[0];
  // const subdomain = "fuga";

  console.log(subdomain, "subdomain");

  // Set tableId in cookies, if it exists
  if (tableId) {
    context.res.setHeader(
      "Set-Cookie",
      cookie.serialize("tableId", tableId, {
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      })
    );
  }

  try {
    const cookies = cookie.parse(context.req.headers.cookie || "");
    const consumerId = cookies.consumerId;
    const deviceId = cookies.deviceId;

    const restaurantIdResponse = await axios.post(
      `https://apitasweeq.hamiltonkw.com/backend/restaurant/get-restaurant-id`,
      {
        restaurant_subdomain: subdomain,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "lang":context.locale
        },
      }
    );

    console.log(restaurantIdResponse, "restaurantIdResponse");

    const restaurantId =
      restaurantIdResponse.data &&
      restaurantIdResponse.data.payload &&
      restaurantIdResponse.data.payload.restaurant_id;

    console.log(restaurantId, "restaurantId");

    if (restaurantId) {
      context.res.setHeader(
        "Set-Cookie",
        cookie.serialize("restaurantId", restaurantId, {
          domain: subdomain,
          path: "/",
          // maxAge: 60 * 60 * 24, // 1 day
        })
      );
    }

    let consumerType = "consumer";
    if (!consumerId) {
      consumerType = "guest";
    }

    const idToUse = consumerId ? consumerId : deviceId;
    const locale = context.locale === "ar" ? "AR" : "EN" || "AR";
    // const locale = "AR";

    // console.log(locale, "locale");
    let cartDetails = [];

    if (idToUse) {
      const cartDetailsResponse = await axios.get(
        `${baseUrl}/api/cart/list-cart-items/${idToUse}/${consumerType}/${locale}`
      );
      cartDetails = cartDetailsResponse.data.payload.cartItems || [];
    }

    const [menuResponse, restaurantResponse] = await Promise.all([
      axios.post(
        `${baseUrl}/backend/restaurant/get-restaurant-menu-backend`,
        {
          restaurant_id: restaurantId, // replace with your actual data
        },
        {
          headers: {
            "Content-Type": "application/json",
                  "lang":locale
          },
        }
      ),
      axios.post(
        `${baseUrl}/backend/restaurant/get-restaurant-details-backend`,
        {
          restaurant_id: restaurantId, // replace with your actual data
        },
        {
          headers: {
            "Content-Type": "application/json",
                  "lang":locale
          },
        }
      ),
    ]);

    console.log(menuResponse, "menuResponse");

    const restaurantDetails = restaurantResponse.data?.payload;

    console.log(restaurantDetails, "restaurantDetails");

    if (menuResponse.data?.payload && menuResponse.data.payload.length > 0) {
      const menuWithItemDetails = await Promise.all(
        menuResponse.data.payload.map(async (category) => {
          const itemDetailsWithItemData = await Promise.all(
            category.itemDetails.map(async (item) => {
              const itemResponse = await axios.post(
                `${baseUrl}/backend/item/get-items`,
                {
                  item_id: item.item_id,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                          "lang":locale
                  },
                }
              );

              return {
                ...item,
                item_data: itemResponse.data.payload,
              };
            })
          );

          return {
            ...category,
            itemDetails: itemDetailsWithItemData,
          };
        })
      );

      console.log(menuWithItemDetails, "menuWithItemDetails");

      return {
        props: {
          restaurantDetails,
          menu: menuWithItemDetails,
          cartDetails,
          ...(await serverSideTranslations(locale, ["common"])),
        },
      };
    } else {
      return {
        props: {
          restaurantDetails,
          menu: [],
          cartDetails,
          ...(await serverSideTranslations(locale, ["common"])),
        },
      };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        error: error.message || "Failed to fetch data",
      },
    };
  }
}

export default MainPage;
