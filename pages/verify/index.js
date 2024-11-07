// import axios from "axios";
import Verify from "@/components/verify";

export default function PhonePage() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          // width: "100vw",
        }}
      >
        <Verify />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const phoneNumber = context.req.cookies.phoneNumber;
  if (!phoneNumber) {
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
