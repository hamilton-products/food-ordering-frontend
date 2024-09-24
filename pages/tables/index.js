import axios from "axios";
import Products from "@/components/tables";

export default function CartPage({ tableDetails }) {
  return (
    <>
      <Products tableDetails={tableDetails} />
    </>
  );
}

export async function getServerSideProps(context) {
  const baseUrl = process.env.NEXT_PRODUCTION_BASE_URL;
  try {
    // Retrieve device_id from cookies in the server-side context
    const consumerId = context.req.cookies.consumerId;
    const deviceId = context.req.cookies.fingerprint;

    let consumerType = "consumer";

    if (!consumerId) {
      consumerType = "guest";
    }

    const idToUse = consumerId ? consumerId : deviceId;

    // Create promises for the API calls
    const fetchTableDetails = axios.post(
      `${baseUrl}/backend/table/get-table`,
      {
        restaurant_id: "RES1708493724LCA58967", // replace with your actual data
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Await both promises
    const [tableResponse] = await Promise.all([fetchTableDetails]);

    const tableDetails = tableResponse.data && tableResponse.data.payload;

    return {
      props: {
        tableDetails: tableDetails,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        error: "Failed to fetch data",
        tableDetails: null,
      },
    };
  }
}
