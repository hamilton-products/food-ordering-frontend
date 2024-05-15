import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Input,
  CardBody,
  Button,
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
} from "@heroicons/react/24/solid";
import { HomeIcon } from "@heroicons/react/24/outline";

function Product({ itemDetails }) {
  // get lat and lng from the cookies and set it to the location state
  const location = Cookies.get("location");
  const router = useRouter();

  const [mobileXtraSmallResponse, setMobileXtraSmallResponse] =
    React.useState(true);
  //   console.log(location, "location");
  const center = {
    lat: location ? JSON.parse(location).lat : 19.076,
    lng: location ? JSON.parse(location).lng : 72.8777,
  };

  console.log(center, "center");

  const Altamash = Cookies.get("saveAddress");
  console.log(location, "location");

  // State to store address details
  const [address, setAddress] = useState({
    area: "",
    houseFlatNo: "",
    landmark: "",
    type: "home",
  });

  React.useEffect(() => {
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

  // // Function to filter menu items based on search query
  // const filteredMenu = menu.map((category) => ({
  //   ...category,
  //   itemDetails: category.itemDetails.filter((item) =>
  //     item.title.toLowerCase().includes(searchQuery.toLowerCase())
  //   ),
  // }));

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await addAddress(address);

    // Here you can use the 'address' state to send the address details to your backend or perform any other action
    console.log("Address submitted:", data[0]);
    // save the address to the cookies in the json format to use it in the checkout page to show the address
    Cookies.set("saveAddress", JSON.stringify(data[0]));
    Cookies.set("address_id", data[0].address_id);
    Cookies.set("address_type", data[0].type);

    // Cookies.set("saveAddress", data[0]);
    router.push("/checkout");
  };

  const hanldeBackButton = () => {
    router.back();
  };

  return (
    <Card className="h-[calc(100vh-5rem)] w-full max-w-[32rem] p-4 shadow-xl shadow-blue-gray-900/5 overflow-y-auto">
      <div className="absolute z-10 mt-1">
        <Button color="black" variant="text" onClick={hanldeBackButton}>
          <ArrowLeftIcon className="h-8 w-8 " />
        </Button>
      </div>

      <div className="mb-2 flex items-center justify-center gap-4 p-4">
        <Typography variant="h5" color="blue-gray">
          Address
        </Typography>
      </div>
      <div className="flex flex-wrap">
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
      </div>

      <div className="flex flex-wrap gap-4 mb-3">
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
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-1 xl:grid-cols-1">
        <form className="" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Address
            </Typography>
            <Input
              size="lg"
              required
              placeholder="Area"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={address.area}
              onChange={(e) => setAddress({ ...address, area: e.target.value })}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              House/Flat No.
            </Typography>
            <Input
              required
              size="lg"
              placeholder="House/Flat No."
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={address.houseFlatNo}
              onChange={(e) =>
                setAddress({ ...address, houseFlatNo: e.target.value })
              }
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Landmark
            </Typography>
            <Input
              size="lg"
              placeholder="Landmark"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={address.landmark}
              onChange={(e) =>
                setAddress({ ...address, landmark: e.target.value })
              }
            />
          </div>
          <div className="group fixed bottom-5 z-50 overflow-hidden mx-5">
            <Button
              size="lg"
              variant="gradient"
              className="flex justify-center items-center gap-48 rounded-full px-36 "
              fullWidth
              type="submit"
              //   onClick={handleAddToCart}
            >
              <span>Add new address</span>
              {/* <span className="flex items-center">KWD {price * qty}</span> */}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}

export default Product;
