import axios from "axios";
import Products from "@/components/cart";

export default function CartPage({ cartDetails, restaurantDetails }) {
  return (
    <>
      {restaurantDetails?<Products
        cartDetails={cartDetails}
        restaurantDetails={restaurantDetails}
      />:<>loading...</>}
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const baseUrl = process.env.NEXT_PRODUCTION_BASE_URL;
    const consumerId = context.req.cookies.consumerId;
    const deviceId = context.req.cookies.fingerprint;
    const restaurantId = context.req.cookies.restaurantId;

    let consumerType = "consumer";

    if (!consumerId) {
      consumerType = "guest";
    }

    
    
    const idToUse = consumerId ? consumerId : deviceId;
    const cartResponse = await axios.get(
      `${baseUrl}/api/cart/list-cart-items/${idToUse}/${consumerType}/EN`
    );
    const restaurantResponse = await axios.post(
      `${baseUrl}/backend/restaurant/get-restaurant-details-backend`,
      {
        restaurant_id: restaurantId, 
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    // console.log(restaurantId,"restaurantId");
 

    const restaurantDetails =
      restaurantResponse.data && restaurantResponse.data.payload;

    const cartDetails =
      cartResponse.data &&
      cartResponse.data.payload &&
      cartResponse.data.payload.cartItems
        ? cartResponse.data.payload.cartItems
        : [];

    return {
      props: {
        restaurantDetails: restaurantDetails,
        cartDetails: cartDetails,
      },
    };
  } catch (error) {
    // console.error("Error fetching data:", error);
    console.error("Full Error:", error.toJSON ? error.toJSON() : error);
    return {

      props: {
        error: "Failed to fetch data",
        restaurantDetails: null,
        cartDetails: [],
      },
    };
  }
}
