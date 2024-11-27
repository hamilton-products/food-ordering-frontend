import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Alert,
  Input,
  CardBody,
  Button,
  Stepper,
  Step,
  CardHeader,
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
  Spinner,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  CheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
  MagnifyingGlassIcon,
  CogIcon,
  UserIcon,
  BuildingLibraryIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { cancelOrder } from "@/pages/api/hello";
import axios from "axios";
import Cookies from "js-cookie";

import {
  HomeIcon,
  BellIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";

// create a chef icon svg and import it here
function ChefIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 2a4 4 0 00-3.464 6H13.464A4 4 0 0010 2zm-1.732 4a2 2 0 013.464 0H8.268zM5 10a5 5 0 1110 0 5 5 0 01-10 0zm0 1a6 6 0 1112 0 6 6 0 01-12 0zm10.536 1a2 2 0 01-3.464 0H15.73z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SidebarWithSearch({ orderDetails, restaurantDetails }) {
  if(!restaurantDetails) return null;
  const router = useRouter();
  const orderStatus = orderDetails.status;
  // console.log(orderStatus, "orderStatus");
  // const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState("");
  // console.log(errorMessage, "efjdshjfhs");

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  const orderItemsDetails = orderDetails.order_details;

  // console.log(orderItemsDetails, "orderItemsDetails");
  // console.log(orderDetails, "orderDetails");

  // Function to determine the active step based on order status
  const getActiveStep = (status) => {
    switch (status) {
      case "new":
        return 0;
      case "confirmed":
        return 1;
      case "ready":
        return 2;
      case "delivered":
        return 3;
      default:
        return 0;
    }
  };

  const activeStep = getActiveStep(orderDetails.status);

  // Function to format date and time
  const formatDateTime = (dateTimeString) => {
    // console.log(dateTimeString, "dateTimeString");
    const date = new Date(dateTimeString);
    return date.toUTCString();
  };

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      const orderId = orderDetails.order_id;
      const response = await cancelOrder(orderId);

      if (response.status === "cancelled") {
        router.push("/orders");
      } else if (response.error) {
        setErrorMessage(response.error.message);
      }
    } catch (error) {
      setErrorMessage("An error occurred while cancelling the order.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  }, [errorMessage]);

  // console.log(orderDetails.status, "sajhdsjahd");
  return (
    <Card className="h-[calc(100vh)] w-full max-w-full sm:max-w-[30rem] sm:min-w-[30rem] md:max-w-[40rem] md:min-w-[40rem] lg:max-w-[40rem] lg:min-w-[40rem] p-4 shadow-xl shadow-blue-gray-900/5 overflow-y-auto rounded-none"
    style={{
      background: "#F4F5F5",
      scrollbarWidth: "none", 
      msOverflowStyle: "none", 
    }}>
      <div className="flex items-left justify-left gap-4 ">
        {/* <img
          src="https://docs.material-tailwind.com/img/logo-ct-dark.png"
          alt="brand"
          className="h-8 w-8"
        /> */}
        <Typography variant="h5" color="blue-gray">
          {orderDetails.order_id}
        </Typography>
      </div>
      <div className="flex justify-between mt-5">
        <div className="mb-2 flex items-left justify-left gap-4 ">
          <Typography variant="small" color="blue-gray">
            {formatDateTime(orderDetails.place_order_time)}
          </Typography>
        </div>
        <div className="mb-2 flex items-right justify-end gap-4 ">
          <Typography variant="small" color="blue-gray">
            {formatDateTime(orderDetails.place_order_time)}
          </Typography>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-1 xl:grid-cols-1">
        <div className="w-full py-5 px-5 mb-5 mt-5">
          <Stepper activeStep={activeStep} class=" grid gap-y-10 lg:gap-y-5 grid-cols-2 lg:grid-cols-4 place-items-center" >
            <Step>
              {activeStep >= 0 ? (
                <ExclamationCircleIcon className="h-8 w-8" />
              ) : (
                <ExclamationCircleIcon className="h-5 w-5" />
              )}
              <div className="absolute -bottom-[2rem] w-max text-center">
                <Typography
                  variant="h6"
                  color={activeStep === 0 ? "blue-gray" : "gray"}
                >
                  Not Confirmed
                </Typography>
              </div>
            </Step>
            <Step>
              {activeStep >= 1 ? (
                <CheckCircleIcon className="h-8 w-8" />
              ) : (
                <CheckBadgeIcon className="h-8 w-8" />
              )}
              <div className="absolute -bottom-[2rem] w-max text-center">
                <Typography
                  variant="h6"
                  color={activeStep === 1 ? "blue-gray" : "gray"}
                >
                  Confirmed
                </Typography>
              </div>
            </Step>
            <Step>
              {activeStep >= 2 ? (
                <CheckCircleIcon className="h-8 w-8" />
              ) : (
                <ChefIcon className="h-5 w-5" />
              )}
              <div className="absolute -bottom-[2rem] w-max text-center">
                <Typography
                  variant="h6"
                  color={activeStep === 2 ? "blue-gray" : "gray"}
                >
                  Food Ready
                </Typography>
              </div>
            </Step>
            <Step>
              {activeStep >= 3 ? (
                <CheckCircleIcon className="h-8 w-8" />
              ) : (
                <BuildingLibraryIcon className="h-5 w-5" />
              )}
              <div className="absolute -bottom-[2rem] w-max text-center">
                <Typography
                  variant="h6"
                  color={activeStep === 3 ? "blue-gray" : "gray"}
                >
                  Delivered
                </Typography>
              </div>
            </Step>
          </Stepper>
        </div>
        <React.Fragment>
          <div className="border-t-2 border-blue-gray-50"></div>
          {orderItemsDetails.map((item, itemIndex) => (
            <div className="flex justify-between">
              <div className="flex items-center justify-left">
                <Typography
                  key={itemIndex}
                  variant="paragraph"
                  color="blue-gray"
                >
                  {item.qty}x
                </Typography>
                <span className="flex items-center px-3">{item.title} </span>
              </div>
              <div className="flex items-center justify-end">
                <span className="flex items-center">
                  {item.item_price} {orderDetails.currency}
                </span>
              </div>
            </div>
          ))}

          <div className="border-t-2 border-blue-gray-50"></div>
          <div className="flex flex-row justify-between items-center">
            <Typography variant="small" color="blue-gray">
              Subtotal:
            </Typography>

            <span className="flex items-center">
              {orderDetails.gross_amount} {orderDetails.currency}
            </span>
          </div>

          <div className="flex flex-row justify-between items-center">
            <Typography variant="small" color="blue-gray">
              Delivery Services:
            </Typography>

            <span className="flex items-center">
              {restaurantDetails.delivery_charge} {orderDetails.currency}
            </span>
          </div>
          {orderDetails.discount_value > 0 && (
            <div className="flex flex-row justify-between items-center">
              <Typography variant="small" color="blue-gray">
                Restaurant Discount:
              </Typography>

              <span className="flex items-center">
                - {orderDetails.discount_value} {orderDetails.currency}
              </span>
            </div>
          )}
          <div className="border-t-2 border-blue-gray-50"></div>
          <div className="flex flex-row justify-between items-center">
            <Typography variant="h6" color="blue-gray">
              Total Amount:
            </Typography>

            <Typography
              variant="h6"
              color="blue-gray"
              className="flex items-center"
            >
              {orderDetails.net_amount} {orderDetails.currency}
            </Typography>
          </div>

          <div className="border-t-2 border-blue-gray-50"></div>
          {orderDetails.status === "new" && (
            <div className="flex items-center justify-center">
              <Button
                onClick={handleCancelOrder}
                size="lg"
                variant="gradient"
                className="rounded-full px-48"
                loading={loading}
              >
                Cancel
              </Button>
            </div>
          )}
        </React.Fragment>

        {/* ))} */}
      </div>
      {errorMessage && (
        <Alert color="red" className="mt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Typography variant="paragraph" className="ml-2">
                {errorMessage}
              </Typography>
            </div>
          </div>
        </Alert>
      )}
    </Card>
  );
}

export default SidebarWithSearch;
