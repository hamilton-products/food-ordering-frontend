import axios from "axios";
import Cookies from "js-cookie";
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
    const device_id = context.req.cookies.fingerprint;

    const response = await axios.get(
      `https://api.talabatsweets.com/api/cart/list-cart-items/${device_id}/guest/EN`
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
