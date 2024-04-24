import axios from "axios";
import Products from "@/components/products";

const MainPage = ({ menu, cartDetails }) => {
  return (
    <>
      <Products menu={menu} cartDetails={cartDetails} />
    </>
  );
};

export async function getServerSideProps(context) {
  try {
    const consumerId = context.req.cookies.consumerId;
    let cartDetails = [];

    if (consumerId) {
      const cartDetailsResponse = await axios.get(
        `http://localhost:9956/api/cart/list-cart-items/${consumerId}/consumer/EN`
      );

      cartDetails = cartDetailsResponse.data.payload.cartItems || [];
    }

    const response = await axios.post(
      "http://localhost:9956/backend/restaurant/get-restaurant-menu-backend",
      {
        restaurant_id: "RES1708493724LCA58967", // replace with your actual data
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
                "http://localhost:9956/backend/item/get-items",
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
