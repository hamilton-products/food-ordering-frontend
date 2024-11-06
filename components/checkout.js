import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Input,
  CardBody,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemPrefix,
  Radio,
  Spinner,
  Alert,
  Avatar,
} from "@material-tailwind/react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Cookies from "js-cookie";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  MapIcon,
  MapPinIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";
import {
  placeOrder,
  getAddressDetails,
  paymentMethod,
  executePayment,
  applyCoupon,
  verifyCoupon,
} from "@/pages/api/hello";
import { add, set } from "lodash";

import PhoneInput from "react-phone-number-input";
import { useRouter } from "next/router";

import Loader from "@/components/loader";
import Image from "next/image";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// I want cross svg for failure
function CrossIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm5.97 14.03a.75.75 0 01-1.06 1.06L12 13.06l-4.91 4.91a.75.75 0 01-1.06-1.06L10.94 12 6.03 7.09a.75.75 0 011.06-1.06L12 10.94l4.91-4.91a.75.75 0 011.06 1.06L13.06 12l4.91 4.91z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Product({
  cartDetails,
  restaurantDetails,
  paymentMethodList,
  // transactionDetails,
  addressDetailss,
  couponDetails,
  subdomain,
}) {
  if(!restaurantDetails) return null;
  const [loading, setLoading] = useState(false);
  console.log(subdomain, "subdomain");

  console.log(cartDetails, "cartDetails mms");
  console.log(couponDetails, "couponDetails");
  console.log(restaurantDetails, "restaurantDetails mms");
  const [mobileXtraSmallResponse, setMobileXtraSmallResponse] = useState(true);
  const [promo, setPromo] = useState("");
  console.log(promo, "promo");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const [couponDiscount, setCouponDiscount] = useState(0);

  console.log(appliedCoupon, "appliedCoupon");

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

  // const transactionStatuss =
  //   transactionDetails.Data && transactionDetails.Data.InvoiceTransactions
  //     ? transactionDetails.Data.InvoiceTransactions[0].TransactionStatus
  //     : "";

  // const [paymentId, setPaymentId] = useState(null);
  // const [transactionStatus, setTransactionStatus] = useState(
  //   transactionStatuss || ""
  // );
  const [open, setOpen] = React.useState(true);
  console.log(addressDetailss, "bhai bolye");

  // const transactionId =
  //   transactionDetails.Data && transactionDetails.Data.InvoiceTransactions
  //     ? transactionDetails.Data.InvoiceTransactions[0].PaymentId
  //     : "";

  // console.log(transactionId, transactionStatuss);

  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const currency = restaurantDetails.currency;
  const delivery = restaurantDetails.delivery_charge;

  const subTotal = cartDetails.reduce(
    (total, item) => total + item.total_price,
    0
  );

  const handleApplyCoupon = async () => {
    setLoading(true);
    setCouponError("");
    try {
      const response = await verifyCoupon(promo, subTotal);
      console.log(response, "response");
      if (response) {
        const coupon = response;
        console.log(coupon, "coupon");
        setAppliedCoupon(coupon);
        // Update the order state with coupon details
        setOrder((prevOrder) => ({
          ...prevOrder,
          coupon_code: coupon.coupon_code,
          coupon_id: coupon.coupon_id,
        }));
      } else {
        setCouponError("Invalid coupon code");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError("Error applying coupon");
    }
    setLoading(false);
  };

  // Calculate discounted total with coupon
  const calculateDiscountedTotal = () => {
    let total = subTotal + delivery;

    // Apply restaurant discount
    const restaurantDiscountValue =
      discountType === "amount"
        ? discountAmount
        : (total * discountAmount) / 100;
    total -= restaurantDiscountValue;

    // Apply coupon discount if available
    if (appliedCoupon) {
      const couponDiscountValue =
        appliedCoupon.discount_type === "percentage"
          ? (total * appliedCoupon.value) / 100
          : appliedCoupon.value;

      // Apply maximum discount cap if exists
      const cappedCouponDiscount = appliedCoupon.maximum_discount_value
        ? Math.min(couponDiscountValue, appliedCoupon.maximum_discount_value)
        : couponDiscountValue;

      console.log(cappedCouponDiscount, "cappedCouponDiscount");

      total -= cappedCouponDiscount;
    }

    return Math.max(total, 0); // Ensure total is not negative
  };

  const discountType = restaurantDetails.discount_type;
  const discountAmount = restaurantDetails.discount_value;

  const total = subTotal + delivery;

  const discountValue =
    discountType === "amount" ? discountAmount : (total * discountAmount) / 100;

  const discountedTotal = calculateDiscountedTotal();

  // Update coupon discount whenever dependencies change
  useEffect(() => {
    if (appliedCoupon) {
      let total = subTotal + delivery;

      // Apply restaurant discount
      const restaurantDiscountValue =
        discountType === "amount"
          ? discountAmount
          : (total * discountAmount) / 100;
      total -= restaurantDiscountValue;

      // Apply coupon discount
      const couponDiscountValue =
        appliedCoupon.discount_type === "percentage"
          ? (total * appliedCoupon.value) / 100
          : appliedCoupon.value;

      // Apply maximum discount cap if exists
      const cappedCouponDiscount = appliedCoupon.maximum_discount_value
        ? Math.min(couponDiscountValue, appliedCoupon.maximum_discount_value)
        : couponDiscountValue;

      setCouponDiscount(cappedCouponDiscount);
    } else {
      setCouponDiscount(0);
    }
  }, [appliedCoupon, subTotal, delivery, discountType, discountAmount]);

  const handleCouponButtonClick = () => {
    if (appliedCoupon) {
      handleRemoveCoupon();
    } else {
      handleApplyCoupon();
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPromo("");
    setOrder((prevOrder) => ({
      ...prevOrder,
      coupon_code: null,
      coupon_id: null,
    }));
  };

  // Update order state when discountedTotal changes
  useEffect(() => {
    const newDiscountedTotal = calculateDiscountedTotal();
    setOrder((prevOrder) => ({
      ...prevOrder,
      net_amount: newDiscountedTotal,
    }));
  }, [subTotal, delivery, discountType, discountAmount, appliedCoupon]);

  console.log(discountedTotal, "discountedTotal");

  const location = Cookies.get("location");
  const center = {
    lat: restaurantDetails.latitude,
    lng: restaurantDetails.longitude,
  };

  // useEffect(() => {
  //   if (transactionId) {
  //     const placeOrderAsync = async () => {
  //       try {
  //         if (transactionId && transactionStatus === "Succss") {
  //           setLoading(true);
  //           const response = await placeOrder(order);
  //           const orderId = response.order_id;

  //           router.push(`/order?orderId=${orderId}`);
  //         }
  //       } catch (error) {
  //         console.error("Error placing order:", error);
  //       }
  //     };

  //     placeOrderAsync();
  //   }
  // }, [transactionId]);

  const [paymentMethodDetails, setPaymentMethodDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await placeOrder(order);
      const orderId = response.order_id;
      if (response) {
        router.push(`/order?orderId=${orderId}`);
        Cookies.set("orderId", orderId);
      } else {
        console.log("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
    setLoading(false);
  };

  const handlePaymentMethod = async () => {
    setSelectedPaymentMethod("online");
    try {
      setLoading(true);
      const details = await paymentMethod();
      const detail = details.PaymentMethods;
      setPaymentMethodDetails(detail);
      setLoading(false);
    } catch (error) {
      console.error("Error handling payment method:", error);
      setLoading(false);
    }
  };
  const handleExecutePayment = async (paymentMethodId) => {
    try {
      setLoading(true);
      // Place the order first
      const orderResponse = await placeOrder(order);
      if (!orderResponse || !orderResponse.order_id) {
        console.log("Failed to place order");
        setLoading(false);
        return;
      }

      const orderId = orderResponse.order_id;
      Cookies.set("orderId", orderId);
      const response = await executePayment(
        paymentMethodId,
        discountedTotal,
        subdomain,
        orderId
      );
      const paymentLink = response.url ? response.url : null;
      // const paymentLink = response.Data ? response.Data.PaymentURL : null;


      window.location.href = paymentLink;
      console.log(response, "response");
    } catch (error) {
      console.error("Error executing payment:", error);
      setLoading(false);
    }
  };

  const [order, setOrder] = useState({
    transaction_id: "",
    address: addressDetailss?.address || "",
    latitude: addressDetailss?.latitude || "",
    longitude: addressDetailss?.longitude || "",
    city: addressDetailss?.city || "",
    apt_name: addressDetailss?.apt_name || "",
    type: addressDetailss?.type || "",
    title: addressDetailss?.title || "",
    net_amount: discountedTotal,
    addressType: addressDetailss?.type || "",
    houseFlatNo: addressDetailss?.floor || "",
    landmark: addressDetailss?.landmark || "",
    grossAmount: subTotal,
    coupon_id: "",
    coupon_code: "",
  });
  console.log(order, "order++++++++++++++");
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setTransactionStatus(null);
  //   }, 5000);
  //   return () => clearTimeout(timer);
  // }, [transactionStatus]);

  const hanldeBackButton = () => {
    router.back();
  };

  return (
    <Card className="h-[calc(100vh)] w-full max-w-full sm:max-w-[20rem] sm:min-w-[20rem] md:max-w-[30rem] md:min-w-[30rem] lg:max-w-[40rem] lg:min-w-[40rem] p-4 shadow-xl shadow-blue-gray-900/5 overflow-y-auto" style={{
      background: "#F4F5F5",
      scrollbarWidth: "none", 
      msOverflowStyle: "none", 
    }}>
      {loading && (
        <div className="fixed top-0 left-0 h-[calc(100vh)] w-full max-w-full sm:max-w-[20rem] sm:min-w-[20rem] md:max-w-[30rem] md:min-w-[30rem] lg:max-w-[40rem] lg:min-w-[40rem] bg-[#0000008a] z-20 flex items-center justify-center" style={{
          background: "#F4F5F5",
          scrollbarWidth: "none", 
          msOverflowStyle: "none", 
        }}>
          <div className="flex items-center justify-center">
            <Spinner className="h-12 w-12" />
          </div>
        </div>
      )}

      <div className="absolute z-10 mt-1">
        <Button color="black" variant="text" onClick={hanldeBackButton}>
          <ArrowLeftIcon className="h-8 w-8 " />
        </Button>
      </div>

      {/* {transactionStatus === "Succss" && (
        <div className="fixed top-0 left-0 h-[calc(100vh)] w-full max-w-full sm:max-w-[20rem] sm:min-w-[20rem] md:max-w-[30rem] md:min-w-[30rem] lg:max-w-[40rem] lg:min-w-[40rem]z-20 flex items-center justify-center">
          <div className="flex items-center justify-center">
            <Alert
              variant="gradient"
              icon={<Icon />}
              className="text-[#2ec946] border-[#2ec946] top-72"
            >
              <Typography className="font-medium">
                Your payment success!
              </Typography>
            </Alert>
          </div>
        </div>
      )} */}

      {/* {transactionStatus === "Failed" && (
        <div className="fixed top-0 left-0 h-[calc(100vh)] w-full max-w-full sm:max-w-[20rem] sm:min-w-[20rem] md:max-w-[30rem] md:min-w-[30rem] lg:max-w-[40rem] lg:min-w-[40rem]z-20 flex items-center justify-center">
          <div className="flex items-center justify-center">
            <Alert
              variant="gradient"
              icon={<CrossIcon />}
              className="text-[#ff4141] border-[#ff2222] top-72"
            >
              <Typography className="font-medium">
                Your payment Failed!
              </Typography>
            </Alert>
          </div>
        </div>
      )} */}

      {/* <div className="fixed top-0 left-0 h-[calc(100vh)] w-full max-w-full sm:max-w-[20rem] sm:min-w-[20rem] md:max-w-[30rem] md:min-w-[30rem] lg:max-w-[40rem] lg:min-w-[40rem]z-20 flex items-center justify-center">
        <div className="flex items-center justify-center">
          <Alert
            variant="gradient"
            icon={<Icon />}
            className="text-[#2ec946] border-[#2ec946] top-72"
          >
            <Typography className="font-medium">
              Ensure that these requirements are met:
            </Typography>
          </Alert>
        </div>
      </div> */}

      <div className="mb-2 flex items-center justify-center gap-4 p-4">
        <Typography variant="h5" color="blue-gray">
          Checkout
        </Typography>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full mb-3">
          <div style={{ height: "300px" }}>
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

      <form onSubmit={handleSubmit}>
        <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-1 xl:grid-cols-1">
          {addressDetailss ? (
            <div className="flex flex-row  items-center">
              <MapPinIcon className="h-12 w-12 text-blue-gray-500 mr-3" />
              <Typography variant="paragraph" color="blue-gray">
                {addressDetailss.address}
              </Typography>
            </div>
          ) : (
            <div className="flex flex-row items-center">
              <InformationCircleIcon className="h-12 w-12 text-blue-gray-500 mr-3" />
              <Typography variant="paragraph" color="blue-gray">
                Please be aware, this is an offline order. Upon confirmation,
                the order cannot be cancelled or modified.
              </Typography>
            </div>
          )}
          <div className="border-t-2 border-blue-gray-50"></div>
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Promo Code
          </Typography>
          <div className="relative flex w-full">
            <Input
              type="text"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              className="pr-20"
              containerProps={{ className: "min-w-0" }}
              disabled={!!appliedCoupon}
            />
            <Button
              size="sm"
              color={promo || appliedCoupon ? "gray" : "blue-gray"}
              disabled={(!promo && !appliedCoupon) || loading}
              className="!absolute right-1 top-1 rounded"
              onClick={handleCouponButtonClick}
            >
              {appliedCoupon ? "Remove" : "Apply"}
            </Button>
          </div>
          {couponError && <Typography color="red">{couponError}</Typography>}
          <div className="border-t-2 border-blue-gray-50"></div>

          <div className="flex flex-row justify-between items-center">
            <Typography variant="h6" color="blue-gray">
              Order Summary
            </Typography>
          </div>
          <div className="border-t-2 border-blue-gray-50"></div>
          <div className="flex flex-row justify-between items-center">
            <Typography variant="small" color="blue-gray">
              Subtotal:
            </Typography>

            <span className="flex items-center">
              {subTotal} {currency}
            </span>
          </div>
          <div className="flex flex-row justify-between items-center">
            <Typography variant="small" color="blue-gray">
              Delivery Services:
            </Typography>

            <span className="flex items-center">
              {delivery} {currency}
            </span>
          </div>
          {discountValue > 0 && (
            <div className="flex flex-row justify-between items-center">
              <Typography variant="small" color="blue-gray">
                Restaurant Discount:
              </Typography>

              <span className="flex items-center">
                - {discountValue} {currency}
              </span>
            </div>
          )}
          {couponDiscount > 0 && (
            <div className="flex flex-row justify-between items-center">
              <Typography variant="small" color="blue-gray">
                Coupon Discount:
              </Typography>

              <span className="flex items-center">
                - {couponDiscount} {currency}
              </span>
            </div>
          )}
          <div className="border-t-2 border-blue-gray-50"></div>
          <div className="flex flex-row justify-between items-center mb-2">
            <Typography variant="h6" color="blue-gray">
              Total:
            </Typography>

            <Typography
              variant="h6"
              color="blue-gray"
              className="flex items-center"
            >
              {discountedTotal} {currency}
            </Typography>
          </div>
        </div>

        <div className="border-t-2 border-blue-gray-50"></div>
        <div className="flex flex-row items-center justify-between mt-3">
          <Typography variant="h6" color="blue-gray">
            Payment Method:
          </Typography>
        </div>

        <List>
          <ListItem className="p-0">
            <label
              htmlFor="vertical-list-react"
              className="flex w-full cursor-pointer items-center px-3 py-2"
            >
              <ListItemPrefix className="mr-3">
                <Radio
                  defaultChecked
                  name="vertical-list"
                  id="vertical-list-react"
                  ripple={false}
                  className="hover:before:opacity-0"
                  containerProps={{
                    className: "p-0",
                  }}
                  onChange={() => setSelectedPaymentMethod("cash")}
                />
              </ListItemPrefix>
              <Typography color="blue-gray" className="font-medium text-black">
                Cash on Delivery
              </Typography>
            </label>
          </ListItem>
          <ListItem className="p-0">
            <label
              htmlFor="vertical-list-vue"
              className="flex w-full cursor-pointer items-center px-3 py-2"
            >
              <ListItemPrefix className="mr-3">
                <Radio
                  name="vertical-list"
                  id="vertical-list-vue"
                  ripple={false}
                  className="hover:before:opacity-0"
                  containerProps={{
                    className: "p-0",
                  }}
                  onChange={() => setSelectedPaymentMethod("online")}
                />
              </ListItemPrefix>
              <Typography color="blue-gray" className="font-medium text-black">
                Online Payment
              </Typography>
            </label>
          </ListItem>
        </List>

        <div className="border-t-2 border-blue-gray-50"></div>
        <div className="flex flex-wrap gap-2 mt-3 mb-3 items-center justify-center">
          {paymentMethodList &&
            paymentMethodList.map((value) => {
              if (
                [1, 3, 6].includes(value.PaymentMethodId) &&
                selectedPaymentMethod === "online"
              ) {
                return (
                  <Card
                    onClick={() => handleExecutePayment(value.PaymentMethodId)}
                    key={value.PaymentMethodId}
                    className="w-full sm:w-[49%] mt-3 overflow-hidden shadow-md shadow-blue-gray-900/5 rounded-none"
                  >
                    <List className="flex-row">
                      <ListItem className="p-0">
                        <ListItemPrefix>
                          <Avatar
                            variant="circular"
                            alt="candice"
                            src={value.ImageUrl}
                            withBorder={true}
                            size="xxl"
                            // className="p-1 h-12 w-full object-cover"
                            className={
                              mobileXtraSmallResponse
                                ? "p-1 h-12 w-full object-cover"
                                : "p-1 h-15 w-20 object-cover"
                            }
                          />
                        </ListItemPrefix>

                        <div>
                          <Typography variant="h6" color="blue-gray">
                            {value.PaymentMethodEn}
                          </Typography>
                        </div>
                      </ListItem>
                    </List>
                  </Card>
                );
              }
            })}
        </div>

        <div className="group  bottom-5  overflow-hidden mx-5 mt-5">
          <Button
            size="lg"
            variant="gradient"
            className="flex justify-center items-center gap-48 rounded-full px-12"
            fullWidth
            type="submit"
          >
            <span>Place Order</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default Product;
