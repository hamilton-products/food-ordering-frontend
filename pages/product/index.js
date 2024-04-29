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
  try {
    const response = await axios.post(
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
