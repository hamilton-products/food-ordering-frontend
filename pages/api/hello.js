// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import Cookies from "js-cookie";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router"; // Import the useRouter hook

export const sendOTP = async (phoneNumber, countryCode) => {
  try {
    const response = await axios.post(
      "https://api.hamilton-bites.online/api/auth/send-otp",
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
      "https://api.hamilton-bites.online/api/auth/verify-mobile-otp",
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
  const deviceId = Cookies.get("fingerprint");
  const restaurantId = Cookies.get("restaurantId");
  let consumerType = "consumer";

  if (!consumerId) {
    consumerType = "guest";
  }

  const idToUse = consumerId ? consumerId : deviceId;

  // Transform data to string format
  transformedData = JSON.stringify(transformedData);

  try {
    let response;

    if (consumerId) {
      response = await axios.post(
        "https://api.hamilton-bites.online/api/cart/add-to-cart/consumer",
        {
          item_id: productId,
          qty: quantity,
          consumer_id: consumerId,
          restaurant_id: restaurantId,
          code: "EN",
          item_options: transformedData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      response = await axios.post(
        "https://api.hamilton-bites.online/api/cart/add-to-cart/guest",
        {
          item_id: productId,
          qty: quantity,
          device_id: deviceId,
          restaurant_id: restaurantId,
          code: "EN",
          item_options: transformedData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return response.data.payload;
  } catch (error) {
    console.error("Error adding to cart:", error);
    // Check if the error is due to item already in the cart
    if (error.response && error.response.status === 406) {
      // console.log("Item already in cart, redirecting to /cart");
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
  const deviceId = Cookies.get("fingerprint");
  let consumerType = "consumer";

  if (!consumerId) {
    consumerType = "guest";
  }

  const idToUse = consumerId ? consumerId : deviceId;

  try {
    const response = await axios.delete(
      `https://api.hamilton-bites.online/api/cart/remove-from-cart/${consumerType}/${idToUse}/${cartId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.payload;
  } catch (error) {
    // console.log("Error while deleting cart");
  }
};

export const updateCart = async (cartId, quantity) => {
  try {
    const response = await axios.post(
      `https://api.hamilton-bites.online/api/cart/update-cart/${cartId}`,
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
    // console.log("Error while updating cart");
  }
};

export const checkCart = async (itemId) => {
  const consumerId = Cookies.get("consumerId");
  const deviceId = Cookies.get("fingerprint");
  let consumerType = "consumer";

  if (!consumerId) {
    consumerType = "guest";
  }

  const idToUse = consumerId ? consumerId : deviceId;

  try {
    const response = await axios.get(
      `https://api.hamilton-bites.online/api/cart/check-item-exists-in-cart/${idToUse}/${consumerType}/${itemId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.payload;
  } catch (error) {
    // console.log("Error while check item cart");
  }
};

export const addAddress = async (address) => {
  const location = Cookies.get("location");
  const latitude = JSON.parse(location).lat;
  const longitude = JSON.parse(location).lng;
  const consumerId = Cookies.get("consumerId");
  // console.log(consumerId, "consumerId");
  const area = address.area;
  try {
    const response = await axios.post(
      `https://api.hamilton-bites.online/api/consumer/manage-delivery-address`,
      {
        consumer_id: consumerId,
        request_type: "add",
        type: address.type,
        address: area,
        latitude: address.lat,
        longitude: address.lng,
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
    // console.log("Error while updating cart");
  }
};

export const placeOrder = async (order) => {
  // console.log(order, "order");
  // console.log(order.transaction_id, "orderh");

  const restaurantId = Cookies.get("restaurantId");

  const consumerId = Cookies.get("consumerId");

  const tableId = Cookies.get("tableId");

  // console.log(tableId, "tableId++++++++++++++");

  try {
    const response = await axios.post(
      `https://api.hamilton-bites.online/api/order/place-order`,
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
          table_id: tableId,
          tax_details: [],
          coupon_code: order.coupon_code,
          gross_amount: order.grossAmount,
          total_tax_amount: 10,
          delivery_fee: 15,
          coupon_id: order.coupon_id,
          net_amount: order.net_amount,
          apt_name: order.apt_name,
          floor: order.houseFlatNo,
          city: order.city,
          address_type: order.addressType,
          address_title: order.address,
          landmark: order.landmark,
          mobile: 11111111,
          consumer_id: consumerId,
          restaurant_id: restaurantId,
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

    // console.log(response, "response");

    return response.data.payload;
  } catch (error) {
    // console.log("Error while updating cart");
  }
};

export const getAddressDetails = async () => {
  const addressId = Cookies.get("address_id");
  const consumerId = Cookies.get("consumerId");
  const addressType = Cookies.get("address_type");
  // console.log(consumerId, "consumerId");

  try {
    const response = await axios.post(
      `https://api.hamilton-bites.online/api/consumer/manage-delivery-address`,
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
    // console.log("Error while getting address");
  }
};

// get payment method

export const paymentMethod = async (data) => {
  const restaurantId = Cookies.get("restaurantId");
  try {
    const response = await axios.get(
      `https://api.hamilton-bites.online/api/payment/payment-method-list?currency=kwd&amount=100&type_id=PYT1572613827KIC107364&code=EN&restaurant_id=${restaurantId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.payload;
  } catch (error) {
    // console.log("Error while getting payment method");
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.post(
      `https://api.hamilton-bites.online/api/consumer/cancel-order-counsumer`,
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
      // console.log("Error while cancelling order");
    }
  }
};

export const executePayment = async (
  paymentMethodId,
  discountedTotal,
  subdomain,
  orderId
) => {
  const consumerId = Cookies.get("consumerId");

  const restaurantId = Cookies.get("restaurantId");

  try {
    const response = await axios.post(
      `https://api.hamilton-bites.online/api/payment/execute-payment`,
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
        restaurant_id: restaurantId,
        subdomain,
        orderId,
        redirect_url:"http://"+window.location.hostname+"/confirmation/"
      },

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data && response.data.payload;
  } catch (error) {
    // console.log("Error while executing payment");
  }
};
export const checkPaymentStatus = async (paymentId) => {
  try {
    // Ensure paymentId is provided
    if (!paymentId) {
      // console.log("Error: Parameter Missing: paymentId is required.");
      return;
    }

    // Prepare the request body
    const requestBody = { paymentId:paymentId };

    // Send the POST request to check the payment status
    const response = await axios.post(
      `https://api.hamilton-bites.online/api/payment/payment-status`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Return the response based on the payment type logic
    if (response.data && response.data.payload) {
      return response.data.payload; // Adjust according to the API's response structure
    } else {
      // console.log("Error: Invalid payment status response.");
      return;
    }
  } catch (error) {
    console.error("Error while checking payment status:", error);
    return null;
  }
};

// Coupon Apply

export const applyCoupon = async (coupon_id, amount) => {
  const consumerId = Cookies.get("consumerId");

  try {
    const response = await axios.post(
      `https://api.hamilton-bites.online/api/coupon/apply-coupon`,
      {
        code: "EN",
        user_id: consumerId,
        coupon_id: coupon_id,
        amount: 8,
      },

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data && response.data.payload;
  } catch (error) {
    // console.log("Error while apply coupon");
  }
};

export const verifyCoupon = async (coupon_code, amount) => {
  const consumerId = Cookies.get("consumerId");
  try {
    const response = await axios.post(
      `https://api.hamilton-bites.online/api/coupon/verify-coupon`,
      {
        code: "EN",
        user_id: consumerId,
        coupon_code: coupon_code,
        amount: amount,
      },

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data && response.data.payload;
  } catch (error) {
    // console.log("Error while apply coupon");
  }
};
