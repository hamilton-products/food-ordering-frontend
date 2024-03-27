import axios from "axios";
import Product from "@/components/product";

export default function ProductPage({ itemDetails }) {
  console.log(itemDetails);
  return (
    <>
      <Product itemDetails={itemDetails} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { itemId } = context.query;
  try {
    const response = await axios.post(
      "https://api.talabatsweets.com/backend/item/get-items",
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
