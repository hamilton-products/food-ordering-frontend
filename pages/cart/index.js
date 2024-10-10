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
  const baseUrl = process.env.NEXT_PRODUCTION_BASE_URL;
  try {
    // Retrieve device_id from cookies in the server-side context
    const consumerId = context.req.cookies.consumerId;
    const deviceId = context.req.cookies.fingerprint;
    const restaurantId = context.req.cookies.restaurantId;

    let consumerType = "consumer";

    if (!consumerId) {
      consumerType = "guest";
    }

    const idToUse = consumerId ? consumerId : deviceId;

    // Create promises for the API calls
    const fetchRestaurantDetails = axios.post(
      `${baseUrl}/backend/restaurant/get-restaurant-details-backend`,
      {
        restaurant_id: restaurantId, // replace with your actual data
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const fetchCartDetails = axios.get(
      `${baseUrl}/api/cart/list-cart-items/${idToUse}/${consumerType}/EN`
    );

    // Await both promises
    const [restaurantResponse, cartResponse] = await Promise.all([
      fetchRestaurantDetails,
      fetchCartDetails,
    ]);

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
    console.error("Error fetching data:", error);
    return {
      props: {
        error: "Failed to fetch data",
        restaurantDetails: null,
        cartDetails: [],
      },
    };
  }
}
