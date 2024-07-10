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

  // Get tableId from query parameters
  const { tableId } = context.query;

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

    let consumerType = "consumer";
    if (!consumerId) {
      consumerType = "guest";
    }

    const idToUse = consumerId ? consumerId : deviceId;
    const locale = context.locale === "ar" ? "AR" : "EN" || "EN";

    console.log(locale, "locale");
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
          restaurant_id: "RES1708493724LCA58967", // replace with your actual data
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
      axios.post(
        `${baseUrl}/backend/restaurant/get-restaurant-details-backend`,
        {
          restaurant_id: "RES1708493724LCA58967", // replace with your actual data
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
    ]);

    const restaurantDetails = restaurantResponse.data?.payload;

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

      return {
        props: {
          restaurantDetails,
          menu: menuWithItemDetails,
          cartDetails,
          ...(await serverSideTranslations(locale, ["common"])),
        },
      };
    } else {
      throw new Error("No data received from API");
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
