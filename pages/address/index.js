import axios from "axios";
import Products from "@/components/address";

export default function AddressPage() {
  return (
    <>
      <Products />
    </>
  );
}

export async function getServerSideProps(context) {
  const consumerId = context.req.cookies.consumerId;
  if (!consumerId) {
    return {
      redirect: {
        destination: "/phone",
        permanent: false,
      },
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
}
