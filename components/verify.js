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
import { useState } from "react";
import { sendOTP } from "@/pages/api/hello";
import { useRouter } from "next/router";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumber } from "libphonenumber-js";

function Phone() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(Array(4).fill(""));
  console.log(phoneNumber);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    otp[index] = element.value;
    setOtp([...otp]);
    if (element.nextSibling) {
      element.nextSibling.focus();
    } else {
      verifyOTP(otp.join(""));
    }
  };

  const verifyOTP = (otp) => {
    // Call your verify API here
    console.log("OTP:", otp);
  };

  const handleSendOTP = async () => {
    try {
      const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
      const countryCode = parsedPhoneNumber.countryCallingCode;
      const nationalNumber = parsedPhoneNumber.nationalNumber;
      console.log(countryCode, "nationalNumber");
      console.log("countryCode", nationalNumber);

      await sendOTP(nationalNumber, countryCode);

      // Handle success (maybe show a message)
      router.push("/verify");
    } catch (error) {
      console.error("Error sending OTP:", error);
      // Handle error (maybe show an error message)
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
          Check WhatsApp for the code sent to
        </Typography>
      </CardHeader>
      <Typography variant="h4" color="blue-gray">
        Didn't get the code?
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Resend (SMS) in 00:00
      </Typography>
      <form className="mt-8 mb-10 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-row gap-6 justify-center">
          {otp.map((data, index) => {
            return (
              <input
                className="otp-field"
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
    </Card>
  );
}

export default Phone;
