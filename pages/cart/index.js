import axios from "axios";
import Products from "@/components/cart";

export default function CartPage({ cartDetails }) {
  return (
    <>
      <Products cartDetails={cartDetails} />
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    // Retrieve device_id from cookies in the server-side context
    const consumerId = context.req.cookies.consumerId;

    if (!consumerId) {
      return {
        redirect: {
          destination: "/phone",
          permanent: false,
        },
      };
    }

    console.log(consumerId, "consumerId");

    const response = await axios.get(
      `http://localhost:9956/api/cart/list-cart-items/${consumerId}/consumer/EN`
    );
    // Check if data exists and is not empty
    if (
      response.data &&
      response.data.payload &&
      response.data.payload.cartItems &&
      response.data.payload.cartItems.length > 0
    ) {
      return {
        props: {
          cartDetails: response.data.payload.cartItems,
        },
      };
    } else {
      return {
        props: {
          cartDetails: [],
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
