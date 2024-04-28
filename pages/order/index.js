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

    const restaurantResponse = await axios.post(
      "https://apitasweek.hamiltonkw.co.in/backend/restaurant/get-restaurant-details-backend",
      {
        restaurant_id: "RES1708493724LCA58967", // replace with your actual data
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const restaurantDetails =
      restaurantResponse.data && restaurantResponse.data.payload;

    console.log(consumerId, "consumerId");

    const response = await axios.get(
      `https://apitasweek.hamiltonkw.co.in/api/order/get-order-details?order_id=${orderId}&code=EN`
    );
    // Check if data exists and is not empty
    if (response.data && response.data.payload) {
      return {
        props: {
          restaurantDetails: restaurantDetails,
          orderDetails: response.data.payload,
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
