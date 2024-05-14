import axios from "axios";
import Products from "@/components/products";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const MainPage = ({ menu, cartDetails }) => {
  return (
    <>
      <Products menu={menu} cartDetails={cartDetails} />
    </>
  );
};

export async function getServerSideProps(context) {
  const baseUrl = process.env.NEXT_PRODUCTION_BASE_URL;
  try {
    const consumerId = context.req.cookies.consumerId;
    const deviceId = context.req.cookies.fingerprint;

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

    const response = await axios.post(
      `${baseUrl}/backend/restaurant/get-restaurant-menu-backend`,
      {
        restaurant_id: "RES1708493724LCA58967", // replace with your actual data
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response, "response.data.payload");

    // Check if data exists and is not empty
    if (
      response.data &&
      response.data.payload &&
      response.data.payload.length > 0
    ) {
      // Fetch item details for each item in the payload
      const menuWithItemDetails = await Promise.all(
        response.data.payload.map(async (category) => {
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
          menu: menuWithItemDetails,
          cartDetails: cartDetails, // Include cartDetails in the return object
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
        error: [],
      },
    };
  }
}

export default MainPage;
