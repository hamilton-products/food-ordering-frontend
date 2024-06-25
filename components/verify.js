"use client";
import {
  ArrowPathIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  CreditCardIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  Input,
  Button,
  Typography,
  CardHeader,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { verifyMobileOTP } from "@/pages/api/hello";
import { useRouter } from "next/router";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumber } from "libphonenumber-js";
import Cookies from "js-cookie";
import axios from "axios";

function Phone() {
  const router = useRouter();
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(Array(4).fill(""));

  const [error, setError] = useState(null); // State to manage error
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      const phone = Cookies.get("phoneNumber");
      const code = Cookies.get("countryCode");
      setPhoneNumber(phone);
      setCountryCode(code);
    };

    fetchUserData();
  }, []);

  const handleChange = (element, index) => {
    // Clear error state when user starts entering a new OTP
    setError(null);

    if (isNaN(element.value)) return;
    otp[index] = element.value;
    setOtp([...otp]);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    } else if (!element.value && element.previousSibling) {
      element.previousSibling.focus();
    }

    // Check if all OTP fields are filled
    if (otp.every((digit) => digit !== "")) {
      verifyOTP(otp.join(""));
    }
  };

  const verifyOTP = async (otp) => {
    setLoading(true);
    // Call your verify API here
    const phoneNumber = Cookies.get("phoneNumber");
    const address = Cookies.get("saveAddress");

    const device_id = Cookies.get("fingerprint");

    try {
      const response = await axios.post(
        "https://apitasweeq.hamiltonkw.com/api/auth/verify-mobile-otp",
        {
          mobile: phoneNumber,
          mobile_country_code: "+" + countryCode,

          otp,
          type: "consumer",
          request_type: "mobile",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      document.cookie = `isVerify=${response.data.payload.is_verify};max-age=86400;path=/`;
      document.cookie = `consumerId=${response.data.payload.consumer_id};max-age=86400;path=/`;

      if (
        response.data.payload.consumer_id &&
        response.data.payload.consumer_id !== null &&
        response.data.payload.consumer_id !== "" &&
        response.data.payload.consumer_id !== undefined
      ) {
        // console.log(response.data.payload.consumer_id);
        await axios.put(
          `https://apitasweeq.hamiltonkw.com/api/cart/move-cart-from-guest/${device_id}/${response.data.payload.consumer_id}`
        );

        // Call remove-all-from-cart API
        await axios.delete(
          `https://apitasweeq.hamiltonkw.com/api/cart/remove-all-from-cart/guest/${device_id}`
        );

        setLoading(false);
      }
      // Assuming you're returning the response data
      router.push("/checkout");
      return response.data.payload;
    } catch (error) {
      if (error.response && error.response.status === 503) {
        // Handle 503 error specifically
        setError("The OTP entered is incorrect.");
        document.cookie = `isVerify=false;max-age=86400;path=/`;
        setLoading(false);
      } else {
        console.error("Error verifying OTP:", error);
        document.cookie = `isVerify=false;max-age=86400;path=/`;
        setLoading(false);
        // Rethrow the error or handle it as per your requirement
        throw error;
      }
    }
  };

  return (
    <Card color="transparent" shadow={true} className="py-5 px-5">
      <CardHeader
        color="gray"
        floated={false}
        shadow={false}
        className="m-0 grid place-items-center px-4 py-8 text-center mb-5"
      >
        <div className="mb-10 h-40 p-6 text-white">
          <ChatBubbleLeftIcon className="h-40 w-40 text-white" />
        </div>

        <Typography variant="paragraph" color="white">
          Check your phone for the verification code.
        </Typography>
        <Typography variant="paragraph" color="white">
          +{countryCode} {phoneNumber}
        </Typography>
      </CardHeader>
      <Typography variant="h4" color="blue-gray">
        Didn't get the code?
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Resend (SMS) in 00:00
      </Typography>

      <form className="mt-8 mb-10 w-80 max-w-screen-lg sm:w-96">
        <div
          className={`mb-1 flex flex-row gap-6 justify-center  ${
            loading === true ? "animate-pulse" : ""
          }`}
        >
          {otp.map((data, index) => {
            return (
              <input
                disabled={loading ? true : false}
                className={`otp-field ${loading ? "bg-gray-500" : ""}`}
                type="text"
                name="otp"
                maxLength="1"
                key={index}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                style={{
                  width: "65px",
                  height: "65px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  textAlign: "center",
                  fontSize: "20px",
                  margin: "0 2px",
                }}
              />
            );
          })}
        </div>
      </form>
      <div className="mb-5 flex flex-row gap-6 justify-center">
        {error && ( // Conditionally render error message
          <Typography variant="paragraph" color="red">
            {error}
          </Typography>
        )}
      </div>
    </Card>
  );
}

export default Phone;
