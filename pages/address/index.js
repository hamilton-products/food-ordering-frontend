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

  // Create a promise for the restaurant details API call
  const fetchRestaurantDetails = axios.post(
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

  try {
    // Await the resolution of the fetchRestaurantDetails promise
    const restaurantResponse = await fetchRestaurantDetails;
    const restaurantDetails =
      restaurantResponse.data && restaurantResponse.data.payload;

    return {
      props: { restaurantDetails: restaurantDetails }, // will be passed to the page component as props
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        error: "Failed to fetch restaurant details", // Include an error message if the request fails
      },
    };
  }
}
