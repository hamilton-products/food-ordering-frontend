import axios from "axios";
import Products from "@/components/address";

export default function AddressPage({ restaurantDetails }) {
  return (
    <>
      <Products restaurantDetails={restaurantDetails} />
    </>
  );
}

export async function getServerSideProps(context) {
  const consumerId = context.req.cookies.consumerId;
  const baseUrl = process.env.NEXT_PRODUCTION_BASE_URL;
  if (!consumerId) {
    return {
      redirect: {
        destination: "/phone",
        permanent: false,
      },
    };
  }

  const restaurantResponse = await axios.post(
    `${baseUrl}/backend/restaurant/get-restaurant-details-backend`,
    {
      restaurant_id: "RES1708493724LCA58967", // replace with your actual data
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const restaurantDetails =
    restaurantResponse.data && restaurantResponse.data.payload;

  return {
    props: { restaurantDetails: restaurantDetails }, // will be passed to the page component as props
  };
}
