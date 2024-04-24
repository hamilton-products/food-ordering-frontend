"use client";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  CreditCardIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { sendOTP } from "@/pages/api/hello";
import { useRouter } from "next/router";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { parsePhoneNumber } from "libphonenumber-js";

function Phone() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  console.log(phoneNumber);

  const handleSendOTP = async () => {
    try {
      const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
      const countryCode = parsedPhoneNumber.countryCallingCode;
      const nationalNumber = parsedPhoneNumber.nationalNumber;
      console.log(countryCode, "nationalNumber");
      console.log("countryCode", nationalNumber);

      await sendOTP(nationalNumber, countryCode);

      // set the phone number in the cookie
      document.cookie = `phoneNumber=${nationalNumber};max-age=86400;path=/`;
      document.cookie = `countryCode=${countryCode};max-age=86400;path=/`;

      // Handle success (maybe show a message)
      router.push("/verify");
    } catch (error) {
      console.error("Error sending OTP:", error);
      // Handle error (maybe show an error message)
    }
  };
  return (
    <Card color="transparent" shadow={true} className="py-5 px-5">
      <Typography variant="h4" color="blue-gray">
        Verify Your Mobile Number
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        You'll receive a one time password shortly.
      </Typography>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Phone Number
          </Typography>
          <PhoneInput
            placeholder="Enter phone number"
            defaultCountry="KW"
            value={phoneNumber}
            onChange={setPhoneNumber}
          />
        </div>

        <Button className="mt-6" fullWidth onClick={handleSendOTP}>
          Send OTP
        </Button>
      </form>

      <div style={{ display: "flex", alignItems: "center" }}>
        <MapPinIcon className="h-5 w-5" />
        <Typography color="gray" className="mx-2 mt-1 text-left font-normal">
          All your addresses in one place
        </Typography>
      </div>
      <hr className="my-2 border-blue-gray-200" />
      <div style={{ display: "flex", alignItems: "center" }}>
        <CreditCardIcon className="h-5 w-5" />
        <Typography color="gray" className="mx-2 mt-1 text-left font-normal">
          Faster payment with KFAST
        </Typography>
      </div>
      <hr className="my-2 border-blue-gray-200" />
      <div style={{ display: "flex", alignItems: "center" }}>
        <ArrowPathIcon className="h-5 w-5" />
        <Typography color="gray" className="mx-2 mt-1 text-left font-normal">
          Re-order with one tap
        </Typography>
      </div>

      <hr className="my-2 border-blue-gray-200" />
      <div style={{ display: "flex", alignItems: "center" }}>
        <CheckCircleIcon className="h-5 w-5" />
        <Typography color="gray" className="mx-2 mt-1 text-left font-normal">
          Terms & Conditions Apply
        </Typography>
      </div>
    </Card>
  );
}

export default Phone;
