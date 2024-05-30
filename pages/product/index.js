import axios from "axios";
import Product from "@/components/product";

export default function ProductPage({ itemDetails, consumerId }) {
  return (
    <>
      <Product itemDetails={itemDetails} consumerId={consumerId} />
    </>
  );
}

export async function getServerSideProps(context) {
  const baseUrl = process.env.NEXT_PRODUCTION_BASE_URL;
  const { itemId } = context.query;
  const consumerId = context.req.cookies.consumerId || "";

  // Create a promise for the API call
  const fetchItemDetails = axios.post(
    `${baseUrl}/backend/item/get-items`,
    {
      item_id: itemId,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  try {
    // Await the resolution of the fetchItemDetails promise
    const response = await fetchItemDetails;

    return {
      props: {
        consumerId: consumerId,
        itemDetails: response.data.payload, // Corrected here
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
