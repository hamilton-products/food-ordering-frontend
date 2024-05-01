// import axios from "axios";
import Phone from "@/components/phone";

export default function PhonePage() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Phone />
      </div>
    </>
  );
}

// export async function getServerSideProps() {
//   try {
//     const response = await axios.post(
//       "https://apitasweek.hamiltonkw.co.in/api/auth/send-otp",
//       {
//         mobile: phoneNumber,
//         request_type: "signUp",
//         mobile_country_code: "+91",
//         type: "guest",
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return {
//       props: {
//         details: response.data.payload, // Corrected here
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return {
//       props: {
//         error: [],
//       },
//     };
//   }
// }
