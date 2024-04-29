import axios from "axios";
import Products from "@/components/orders";

export default function CartPage({ pastOrderList, currentOrderList }) {
  return (
    <>
      <Products
        pastOrderList={pastOrderList}
        currentOrderList={currentOrderList}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const baseUrl = process.env.NEXT_PRODUCTION_BASE_URL;
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

    const currentResponse = await axios.get(
      `${baseUrl}/api/order/get-order-list?request_type=current&consumer_id=${consumerId}&code=EN`
    );
    const currentOrderList =
      currentResponse.data && currentResponse.data.payload;

    const pastResponse = await axios.get(
      `${baseUrl}/api/order/get-order-list?request_type=past&consumer_id=${consumerId}&code=EN`
    );
    const pastOrderList = pastResponse.data && pastResponse.data.payload;

    return {
      props: {
        currentOrderList: currentOrderList,
        pastOrderList: pastOrderList,
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
