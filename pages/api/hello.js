// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router"; // Import the useRouter hook

export const sendOTP = async (phoneNumber, countryCode) => {
  try {
    const response = await axios.post(
      "https://api.talabatsweets.com/api/auth/send-otp",
      {
        mobile: phoneNumber, // Assuming phoneNumber is passed in the request body
        request_type: "signUp",
        mobile_country_code: countryCode,
        type: "consumer",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Assuming you're returning the response data
    return response.data.payload;
  } catch (error) {
    console.error("Error sending OTP:", error);
    // Rethrow the error or handle it as per your requirement
    throw error;
  }
};

export const verifyOTP = async (phoneNumber, countryCode, otp) => {
  try {
    const response = await axios.post(
      "https://api.talabatsweets.com/api/auth/verify-otp",
      {
        mobile: phoneNumber, // Assuming phoneNumber is passed in the request body
        mobile_country_code: countryCode,
        otp,
        type: "consumer",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Assuming you're returning the response data
    return response.data.payload;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    // Rethrow the error or handle it as per your requirement
    throw error;
  }
};

export const addToCart = async (productId, quantity, redirectToCart) => {
  const device_id = Cookies.get("fingerprint");
  try {
    const response = await axios.post(
      "https://api.talabatsweets.com/api/cart/add-to-cart/guest",
      {
        item_id: productId,
        qty: quantity,
        device_id: device_id,
        restaurant_id: "RES1708493724LCA58967",
        code: "EN",
        item_options: "[]", // send as a string
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.payload;
  } catch (error) {
    console.error("Error adding to cart:", error);
    // Check if the error is due to item already in the cart
    if (error.response && error.response.status === 406) {
      console.log("Item already in cart, redirecting to /cart");
      redirectToCart(); // Execute the redirection callback
    } else {
      console.error("Unhandled error:", error); // Log the unhandled error
    }
    // Return null or handle error as needed
    return null;
  }
};
