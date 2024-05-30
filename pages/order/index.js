import axios from "axios";
import Products from "@/components/order";

export default function CartPage({ orderDetails, restaurantDetails }) {
  return (
    <>
      <Products
        orderDetails={orderDetails}
        restaurantDetails={restaurantDetails}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    // Retrieve device_id from cookies in the server-side context
    const consumerId = context.req.cookies.consumerId;
    const { orderId } = context.query;

    if (!consumerId) {
      return {
        redirect: {
          destination: "/phone",
          permanent: false,
        },
      };
    }

    const restaurantPromise = axios.post(
      "https://apitasweeq.hamiltonkw.com/backend/restaurant/get-restaurant-details-backend",
      {
        restaurant_id: "RES1708493724LCA58967", // replace with your actual data
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const orderPromise = axios.get(
      `https://apitasweeq.hamiltonkw.com/api/order/get-order-details?order_id=${orderId}&code=EN`
    );

    // Use Promise.all to resolve all promises concurrently
    const [restaurantResponse, orderResponse] = await Promise.all([
      restaurantPromise,
      orderPromise,
    ]);

    const restaurantDetails =
      restaurantResponse.data && restaurantResponse.data.payload;

    console.log(consumerId, "consumerId");

    // Check if order data exists and is not empty
    if (orderResponse.data && orderResponse.data.payload) {
      return {
        props: {
          restaurantDetails: restaurantDetails,
          orderDetails: orderResponse.data.payload,
        },
      };
    } else {
      return {
        props: {
          orderDetails: [],
        },
      };
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
