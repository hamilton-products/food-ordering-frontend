// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router"; // Import the useRouter hook

export const sendOTP = async (phoneNumber, countryCode) => {
  try {
    const response = await axios.post(
      "http://localhost:9956/api/auth/send-otp",
      {
        mobile: phoneNumber, // Assuming phoneNumber is passed in the request body
        request_type: "signUp",
        mobile_country_code: "+" + countryCode,
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

export const verifyMobileOTP = async (countryCode, otp) => {
  const phoneNumber = Cookies.get("phoneNumber");
  try {
    const response = await axios.post(
      "http://localhost:9956/api/auth/verify-mobile-otp",
      {
        mobile: phoneNumber,
        mobile_country_code: "+" + countryCode,
        otp,
        type: "consumer",
        request_type: "mobile",
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
    if (error.response && error.response.status === 503) {
      // Handle 503 error specifically
      console.error("Service unavailable. Please try again later.");
    } else {
      console.error("Error verifying OTP:", error);
      // Rethrow the error or handle it as per your requirement
      throw error;
    }
  }
};

export const addToCart = async (productId, quantity, transformedData) => {
  const consumerId = Cookies.get("consumerId");
  console.log(consumerId, "consumerIdssss");

  // I want transformedData in a stringfy format
  transformedData = JSON.stringify(transformedData);
  try {
    const response = await axios.post(
      "http://localhost:9956/api/cart/add-to-cart/consumer",
      {
        item_id: productId,
        qty: quantity,
        consumer_id: consumerId,
        restaurant_id: "RES1708493724LCA58967",
        code: "EN",
        item_options: transformedData, // send as a string
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

export const deleteCart = async (cartId) => {
  const consumerId = Cookies.get("consumerId");

  try {
    const response = await axios.delete(
      `http://localhost:9956/api/cart/remove-from-cart/consumer/${consumerId}/${cartId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.payload;
  } catch (error) {
    console.log("Error while deleting cart");
  }
};

export const updateCart = async (cartId, quantity) => {
  try {
    const response = await axios.post(
      `http://localhost:9956/api/cart/update-cart/${cartId}`,
      {
        qty: quantity,
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
    console.log("Error while updating cart");
  }
};

export const checkCart = async (itemId) => {
  const consumerId = Cookies.get("consumerId");

  try {
    const response = await axios.get(
      `http://localhost:9956/api/cart/check-item-exists-in-cart/${consumerId}/consumer/${itemId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.payload;
  } catch (error) {
    console.log("Error while check item cart");
  }
};

export const addAddress = async (address) => {
  const location = Cookies.get("location");
  const latitude = JSON.parse(location).lat;
  const longitude = JSON.parse(location).lng;
  const consumerId = Cookies.get("consumerId");
  console.log(consumerId, "consumerId");
  const area = address.area;
  try {
    const response = await axios.post(
      `http://localhost:9956/api/consumer/manage-delivery-address`,
      {
        consumer_id: consumerId,
        request_type: "add",
        type: address.type,
        address: area,
        latitude: latitude,
        longitude: longitude,
        floor: address.houseFlatNo,
        landmark: address.landmark,
      },

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.payload;
  } catch (error) {
    console.log("Error while updating cart");
  }
};

export const placeOrder = async (order) => {
  console.log(order, "order");
  console.log(order.transaction_id, "orderh");

  const consumerId = Cookies.get("consumerId");

  try {
    const response = await axios.post(
      `http://localhost:9956/api/order/place-order`,
      {
        place_order_json: JSON.stringify({
          // transaction_id: "",
          // tax_details: "",
          // coupon_code: "",
          // coupon_id: "",
          // apt_name: "",
          // floor: 2,
          // city: "",
          // address_type: "",
          // address_title: "",
          // landmark: "",
          // mobile: 8854164,
          // gross_amount: 200,
          // total_tax_amount: 1,
          // delivery_fee: 1,
          // consumer_id: "CON1713265477UTT21423",
          // restaurant_id: "RES1708493724LCA58967",
          // deliver_to_latitude: latitude,
          // deliver_to_longitude: longitude,
          transaction_id: order.transaction_id,
          tax_details: [],
          coupon_code: "",
          gross_amount: order.grossAmount,
          total_tax_amount: 10,
          delivery_fee: 15,
          coupon_id: "",
          net_amount: order.net_amount,
          apt_name: order.apt_name,
          floor: order.houseFlatNo,
          city: order.city,
          address_type: order.addressType,
          address_title: order.address,
          landmark: order.landmark,
          mobile: 11111111,
          consumer_id: consumerId,
          restaurant_id: "RES1708493724LCA58967",
          deliver_to_latitude: order.latitude,
          deliver_to_longitude: order.longitude,
        }),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.payload;
  } catch (error) {
    console.log("Error while updating cart");
  }
};

export const getAddressDetails = async () => {
  const addressId = Cookies.get("address_id");
  const consumerId = Cookies.get("consumerId");
  const addressType = Cookies.get("address_type");
  console.log(consumerId, "consumerId");

  try {
    const response = await axios.post(
      `http://localhost:9956/api/consumer/manage-delivery-address`,
      {
        consumer_id: consumerId,
        request_type: "get",
        type: addressType,
        address_id: addressId,
      },

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data && response.data.payload;
  } catch (error) {
    console.log("Error while getting address");
  }
};

// get payment method

export const paymentMethod = async (data) => {
  try {
    const response = await axios.get(
      `http://localhost:9956/api/payment/payment-method-list?currency=kwd&amount=100&type_id=PYT1572613827KIC107364&code=EN&restaurant_id=RES1708493724LCA58967`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.payload;
  } catch (error) {
    console.log("Error while getting payment method");
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.post(
      `http://localhost:9956/api/consumer/cancel-order-counsumer`,
      {
        order_id: orderId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.payload;
  } catch (error) {
    if (error.response && error.response.data.error.code === 406) {
      return error.response.data;
    } else {
      console.log("Error while cancelling order");
    }
  }
};

export const executePayment = async (paymentMethodId, discountedTotal) => {
  const consumerId = Cookies.get("consumerId");

  try {
    const response = await axios.post(
      `http://localhost:9956/api/payment/execute-payment`,
      {
        currency: 1,
        code: "EN",
        consumerId: consumerId,
        PaymentMethodId: paymentMethodId,
        invoiceValue: discountedTotal,
        cardNumber: "5453010000095539",
        expiryMonth: "12",
        expiryYear: "25",
        securityCode: "300",
        restaurant_id: "RES1708493724LCA58967",
      },

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data && response.data.payload;
  } catch (error) {
    console.log("Error while executing payment");
  }
};
