import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Input,
  CardBody,
  Button,
  Alert,
} from "@material-tailwind/react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Cookies from "js-cookie";
import { addAddress } from "@/pages/api/hello";
import { useRouter } from "next/router";
import {
  ArrowLeftIcon,
  BuildingLibraryIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  HomeModernIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { HomeIcon } from "@heroicons/react/24/outline";

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );
}

function Product({ addressDetails }) {
  const location = Cookies.get("location");
  const router = useRouter();

  console.log(addressDetails, "addressDetails");

  //   const deliveryAreaCoordinates =
  //     restaurantDetails.restaraunt_delivery_areas &&
  //     restaurantDetails.restaraunt_delivery_areas.coordinates[0];

  const [mobileXtraSmallResponse, setMobileXtraSmallResponse] = useState(true);
  const [message, setMessage] = useState(null);
  const [locationSelected, setLocationSelected] = useState(false); // Track if location is selected

  const center = {
    lat: location ? JSON.parse(location).lat : 19.076,
    lng: location ? JSON.parse(location).lng : 72.8777,
  };

  const [address, setAddress] = useState({
    area: "",
    houseFlatNo: "",
    landmark: "",
    type: "home",
    lat: center.lat,
    lng: center.lng,
  });

  useEffect(() => {
    const handleResizeXtraSmall = () => {
      if (window.innerWidth < 460) {
        setMobileXtraSmallResponse(false);
      } else {
        setMobileXtraSmallResponse(true);
      }
    };
    handleResizeXtraSmall();
    window.addEventListener("resize", handleResizeXtraSmall);
    return () => window.removeEventListener("resize", handleResizeXtraSmall);
  }, []);

  const hanldeBackButton = () => {
    router.back();
  };

  const handleAddAddress = () => {
    router.push("/address");
  };

  const handleSetAddressId = (address_id) => {
    router.push("/checkout");
    Cookies.set("address_id", address_id);
  };

  let autocomplete;
  function initAutocomplete() {
    const google = window.google;
    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete"),
      { types: ["geocode"] }
    );
    autocomplete.addListener("place_changed", fillInAddress);
  }

  async function fillInAddress() {
    const place = autocomplete.getPlace();
    console.log("Place object:", place); // Log the place object to see its structure

    // Check if the place object contains the necessary data
    if (!place.geometry || !place.geometry.location) {
      setMessage("Invalid location. Please select a valid address.");
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    console.log(isWithinDeliveryArea);

    if (!isWithinDeliveryArea) {
      setMessage("Delivery not available in this area");
      return;
    }

    if (isWithinDeliveryArea) {
      setLocationSelected(true); // Mark location as selected
    }

    setAddress({
      ...address,
      area: place.formatted_address,
      lat: lat,
      lng: lng,
    });
  }

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <Card className="h-[calc(100vh)] w-full max-w-full sm:max-w-[30rem] sm:min-w-[30rem] md:max-w-[40rem] md:min-w-[40rem] lg:max-w-[40rem] lg:min-w-[40rem]  p-4 shadow-xl shadow-blue-gray-900/5 overflow-y-auto" 
    style={{
      background: "#F4F5F5",
      scrollbarWidth: "none", 
      msOverflowStyle: "none", 
    }}>
      <div className="absolute z-10 mt-1">
        <Button color="black" variant="text" onClick={hanldeBackButton}>
          <ArrowLeftIcon className="h-8 w-8 " />
        </Button>
      </div>

      <div className="mb-2 flex items-center justify-center gap-4 p-4">
        <Typography variant="h5" color="blue-gray">
          Delivery
        </Typography>
      </div>

      {/* <div className="flex flex-wrap">
        <div className="w-full mb-3">
          <div style={{ height: "400px" }}>
            <GoogleMap
              mapContainerStyle={{ height: "100%", width: "100%" }}
              center={center}
              zoom={8}
            >
              <Marker position={center} />
            </GoogleMap>
          </div>
        </div>
      </div> */}

      {/* <div className="flex flex-wrap gap-4 mb-3">
        <Card
          style={{
            cursor: "pointer",
            border: `${address.type === "home" ? "1px solid #000" : ""}`,
          }}
          className="w-[30%] h-32 flex flex-col items-center justify-center bg-blue-gray-50"
          onClick={() => setAddress({ ...address, type: "home" })}
        >
          <CardBody className="text-center">
            <HomeIcon className="w-16 h-16 " />

            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 flex flex-col items-center justify-center"
            >
              House
            </Typography>
          </CardBody>
        </Card>
        <Card
          style={{
            cursor: "pointer",
            border: `${address.type === "work" ? "1px solid #000" : ""}`,
          }}
          className="w-[30%] h-32 flex flex-col items-center justify-center bg-blue-gray-50"
          onClick={() => setAddress({ ...address, type: "work" })}
        >
          <CardBody>
            <BuildingOfficeIcon className="w-16 h-16 " />
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 flex flex-col items-center justify-center"
            >
              Apartment
            </Typography>
          </CardBody>
        </Card>
        <Card
          style={{
            cursor: "pointer",
            border: `${address.type === "other" ? "1px solid #000" : ""}`,
          }}
          className="w-[30%] h-32 flex flex-col items-center justify-center bg-blue-gray-50"
          onClick={() => setAddress({ ...address, type: "other" })}
        >
          <CardBody>
            <BuildingLibraryIcon className="w-16 h-16 " />

            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 flex flex-col items-center justify-center"
            >
              Other
            </Typography>
          </CardBody>
        </Card>
      </div> */}
      <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-1 xl:grid-cols-1 mb-3">
        <Typography variant="h5" color="blue-gray">
          Select Address
        </Typography>
      </div>
      <div className="border-t-2 border-blue-gray-50"></div>

      <div
        onClick={handleAddAddress}
        className="flex flex-row  items-center pt-3 mb-5 cursor-pointer"
      >
        <MapPinIcon className="h-8 w-8 text-blue-gray-500 mr-3" />
        <Typography variant="h6" color="blue-gray">
          Deliver to new area
        </Typography>
      </div>

      <div className="border-t-2 border-blue-gray-50"></div>
      <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-1 xl:grid-cols-1 mb-3 mt-3">
        {addressDetails.length > 0 &&
          addressDetails.map((detail, index) => (
            <div
              className="cursor-pointer"
              key={index}
              onClick={() => handleSetAddressId(detail.address_id)}
            >
              <Typography variant="h5" color="blue-gray">
                {detail.floor}
              </Typography>
              <Typography variant="small" color="blue-gray">
                {detail.address}
              </Typography>
              <div className="border-t-2 border-blue-gray-50 mt-3"></div>
            </div>
          ))}
      </div>
    </Card>
  );
}

export default Product;
