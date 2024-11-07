import axios from "axios";
import Delivery from "@/components/delivery";

export default function DeliveryPage({ addressDetails }) {
  return (
    <>
      <Delivery addressDetails={addressDetails} />
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

  try {
    const addressResponse = await axios.post(
      `${baseUrl}/api/consumer/manage-delivery-address`,
      {
        consumer_id: consumerId,
        request_type: "list",
        type: "other",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const addressDetails = addressResponse.data?.payload || [];
    console.log(addressDetails,"addressDetails");
    
    return {
      props: {
        addressDetails: addressDetails,
      },
    };
  } catch (error) {
    console.error("Error fetching address details:", error);
    return {
      props: {
        addressDetails: [],
      },
    };
  }
}
