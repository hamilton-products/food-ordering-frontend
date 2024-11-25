import axios from "axios";
import Checkout from "@/components/checkout";

export default function AddressPage({
  // transactionDetails,
  cartDetails,
  restaurantDetails,
  paymentMethodList,
  addressDetailss,
  couponDetails,
  subdomain,
}) {
  return (
    <>
      <Checkout
        addressDetailss={addressDetailss}
        paymentMethodList={paymentMethodList}
        cartDetails={cartDetails}
        restaurantDetails={restaurantDetails}
        // transactionDetails={transactionDetails}
        couponDetails={couponDetails}
        subdomain={subdomain}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const baseUrl = process.env.NEXT_PRODUCTION_BASE_URL;
  let transactionDetails = {}; // Declare transactionDetails here
  const host = context.req.headers.host || "fuga";

  // console.log(host, "host++");
  const subdomain = host.split(".")[0];

  try {
    const device_id = context.req.cookies.fingerprint;
    const addressId = context.req.cookies.address_id;
    const addressType = context.req.cookies.address_type;
    const consumerId = context.req.cookies.consumerId;
    const tableId = context.req.cookies.tableId;
    const restaurantId = context.req.cookies.restaurantId;

    // console.log(tableId, "tableId");

    if (!consumerId) {
      return {
        redirect: {
          destination: "/phone",
          permanent: false,
        },
      };
    } else if (!(addressId || tableId)) {
      return {
        redirect: {
          destination: "/address",
          permanent: false,
        },
      };
    }

    const paymentId = context.query.paymentId;
    // console.log(paymentId, "paymentId");
    // console.log(addressId, "addressId1", addressType, "addressType");

    const cartPromise = axios.get(
      `${baseUrl}/api/cart/list-cart-items/${consumerId}/consumer/EN`
    );

    // console.log(cartPromise, "cartPromiseA");
    // console.log(consumerId, "consumerIdA");

    const restaurantPromise = axios.post(
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

    const paymentMethodPromise = axios.get(
      `${baseUrl}/api/payment/payment-method-list`,
      {
        params: {
          currency: "kwd",
          type_id: "PYT1572591869XMA79487",
          code: "EN",
          amount: 100,
          restaurant_id: restaurantId,
        },
      }
    );

    const couponPromise = axios.get(
      `${baseUrl}/api/coupon/get-coupon`,
      {
        params: {
          code: "EN",
          restaurant_id: restaurantId,
        },
      }
    );

    // Use Promise.all to resolve all promises concurrently
    const [
      cartResponse,
      restaurantResponse,
      paymentMethodResponse,
      couponResponse,
    ] = await Promise.all([
      cartPromise,
      restaurantPromise,
      paymentMethodPromise,
      couponPromise,
    ]);

    const cartDetails =
      cartResponse.data &&
      cartResponse.data.payload &&
      cartResponse.data.payload.cartItems &&
      cartResponse.data.payload.cartItems.length > 0
        ? cartResponse.data.payload.cartItems
        : [];

    // console.log(cartDetails, "cartDetails");

    if (!cartDetails || cartDetails.length === 0) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const restaurantDetails =
      restaurantResponse.data && restaurantResponse.data.payload;
    // console.log(restaurantDetails, "restaurantDetails");

    const restStatus = restaurantDetails.availability_status;
    // console.log(restStatus, "restStatus");

    if (restStatus === "offline") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const paymentMethodList =
      paymentMethodResponse.data &&
      paymentMethodResponse.data.payload &&
      paymentMethodResponse.data.payload.PaymentMethods;
    // console.log(paymentMethodList, "paymentMethodList");

    const couponDetails = couponResponse.data && couponResponse.data.payload;
    // console.log(couponDetails, "couponDetails");

    // Handle payment status if paymentId is present
    // if (paymentId) {
    //   const paymentStatusResponse = await axios.post(
    //     `${baseUrl}/api/payment/payment-status`,
    //     {
    //       paymentId: paymentId,
    //     }
    //   );

    //   transactionDetails =
    //     paymentStatusResponse.data && paymentStatusResponse.data.payload;
    // }

    // // console.log(transactionDetails, "transactionDetails Altamash");

    let addressDetailss = null;

    // Fetch address details only if tableId is not present
    if (!tableId) {
      const addressResponse = await axios.post(
        `${baseUrl}/api/consumer/manage-delivery-address`,
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

      // console.log(addressResponse, "addressResponse");

      addressDetailss = addressResponse.data && addressResponse.data.payload;
    }

    return {
      props: {
        addressDetailss: addressDetailss,
        // transactionDetails: transactionDetails,
        paymentMethodList: paymentMethodList,
        cartDetails: cartDetails,
        restaurantDetails: restaurantDetails,
        couponDetails: couponDetails,
        subdomain: subdomain,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        error: [],
      },
    };
  }
}
