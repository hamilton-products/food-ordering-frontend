import React from "react";
import {
  Card,
  Typography,
  Alert,
  CardBody,
  Button,
  CardHeader,
} from "@material-tailwind/react";
import {
  ShoppingBagIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/router";
import { deleteCart, updateCart } from "@/pages/api/hello";
import axios from "axios";
import Cookies from "js-cookie";
import { debounce } from "lodash";

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

function SidebarWithSearch({ cartDetails, restaurantDetails }) {
  // if(!restaurantDetails) return null;
  // // console.log(cartDetails, "menushsg");
  const router = useRouter();
  const {locale}=router
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);
  const [cartItems, setCartItems] = React.useState(cartDetails);
  // // console.log(cartItems, "cartItems");

  // // console.log(cartItems, "cartItems");

  const currency = restaurantDetails.currency;
  const delivery = restaurantDetails.delivery_charge;

  const restStatus = restaurantDetails.availability_status;
  // // console.log(restStatus, "restStatus");

  const discountType = restaurantDetails.discount_type;
  const discountAmount = restaurantDetails.discount_value;

  const subTotal = cartItems.reduce(
    (total, item) => total + item.total_price,
    0
  );

  const total = subTotal + delivery;

  const discountValue =
    discountType === "amount" ? discountAmount : (total * discountAmount) / 100;

  const discountedTotal =
    total -
    (discountType === "amount"
      ? discountAmount
      : (total * discountAmount) / 100);

  const [cartExits, setCartExists] = React.useState(true);

  const [mobileResponse, setMobileResponse] = React.useState(true);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 488) {
        setMobileResponse(false);
      } else {
        setMobileResponse(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToItemDetails = (itemId) => {
    router.push(`/product?itemId=${itemId}`);
  };

  const consumerId = Cookies.get("consumerId");
  const deviceId = Cookies.get("fingerprint");
  let consumerType = "consumer";

  if (!consumerId) {
    consumerType = "guest";
  }

  const idToUse = consumerId ? consumerId : deviceId;

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `https://api.hamilton-bites.online/api/cart/list-cart-items/${idToUse}/${consumerType}/${locale=="ar"?"AR":"EN"}`
      );
      if (
        response.data &&
        response.data.payload &&
        response.data.payload.cartItems &&
        response.data.payload.cartItems.length > 0
      ) {
        setCartItems(response.data.payload.cartItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  React.useEffect(() => {
    fetchCartItems();
  }, []);

  const handleDeleteCart = async (cartId) => {
    try {
      await deleteCart(cartId);
      fetchCartItems(); // refresh cart items after deleting an item
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  const [qtyMap, setQtyMap] = React.useState({});

  React.useEffect(() => {
    // Initialize quantity map with quantities from cartDetails
    const initialQtyMap = {};
    cartDetails.forEach((item) => {
      initialQtyMap[item.cart_id] = item.qty;
    });
    setQtyMap(initialQtyMap);
  }, [cartDetails]);

  const debouncedUpdateCartDetails = React.useRef(
    debounce(async (cartId, qty) => {
      try {
        await updateCart(cartId, qty);
        fetchCartItems(); // refresh cart items after updating quantity
      } catch (error) {
        console.error("Error updating item from cart:", error);
      }
    }, 500) // Adjust the debounce delay as needed
  ).current;

  const incrementQty = (cartId) => {
    const updatedQtyMap = { ...qtyMap };
    updatedQtyMap[cartId] = (updatedQtyMap[cartId] || 0) + 1;
    setQtyMap(updatedQtyMap);
    debouncedUpdateCartDetails(cartId, updatedQtyMap[cartId]);
  };

  const decrementQty = (cartId) => {
    const updatedQtyMap = { ...qtyMap };
    if (updatedQtyMap[cartId] > 1) {
      updatedQtyMap[cartId] -= 1;
      setQtyMap(updatedQtyMap);
      debouncedUpdateCartDetails(cartId, updatedQtyMap[cartId]);
    } else if (updatedQtyMap[cartId] === 1) {
      handleDeleteCart(cartId);
    }
  };

  const updateCartDetails = async (cartId, qty) => {
    try {
      await updateCart(cartId, qty);
      fetchCartItems(); // refresh cart items after updating quantity
    } catch (error) {
      //eror
      console.error("Error updating item from cart:", error);
    }
  };

  const placeOrderHandler = () => {
    const addressId = Cookies.get("address_id");
    const tableId = Cookies.get("tableId") && Cookies.get("tableId")!=="undefined"?Cookies.get("tableId"):null;
    if (tableId) {
      router.push("/checkout");
    } else {
      router.push("/address");
    }
  };

  const addMoreItemHandler = () => {
    router.push("/");
  };

  const hanldeBackButton = () => {
    router.back();
  };
  return (
<Card
  className={`h-full w-full max-w-full sm:max-w-[30rem] sm:min-w-[30rem] md:max-w-[40rem] md:min-w-[40rem] lg:max-w-[40rem] lg:min-w-[40rem] p-4 rounded-none flex flex-col bg-white shadow-lg`}
  style={{ direction: locale === "ar" ? "rtl" : "ltr" }} // Adjust direction
>
  {/* Back Button */}
  <div className={`absolute z-10 mt-1 ${locale === "ar" ? "right-4" : "left-4"}`}>
    <Button color="dark" variant="text" onClick={hanldeBackButton}>
      <ArrowLeftIcon className="h-8 w-8" />
    </Button>
  </div>

  {/* Title */}
  <div className="flex items-center justify-center py-4 border-b border-gray-200">
    <Typography variant="h6" color="blue-gray" className="font-bold">
      {locale === "ar" ? "سلة التسوق" : "My Cart"}
    </Typography>
  </div>

  {/* Check if cart is empty */}
  {cartItems.length === 0 ? (
    <div className="flex flex-col items-center justify-center flex-1 py-10">
      <Typography variant="h6" color="blue-gray" className="mb-4">
        {locale === "ar" ? "سلة التسوق فارغة" : "Your Cart is Empty"}
      </Typography>
      <Button
        variant="gradient"
        size="lg"
        onClick={() => window.location.href = "/"}
        className="text-center"
      >
        {locale === "ar" ? "العودة إلى الصفحة الرئيسية" : "Go to Home"}
      </Button>
    </div>
  ) : (
    <>
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto py-4">
        {cartItems.map((item, itemIndex) => (
          <div
            key={itemIndex}
            className="flex items-center justify-between bg-gray-50 p-4 mb-3 rounded-lg shadow-sm"
          >
            {/* Image */}
            <div className="w-1/4">
              <Image
                width={256}
                height={256}
                src={item.item_cover_photo}
                alt={item.item_name}
                className="h-16 w-16 rounded object-cover"
              />
            </div>

            {/* Item Details */}
            <div className="w-2/4 px-3">
              <Typography variant="subtitle2" color="blue-gray" className="font-medium">
                {item.item_name}
              </Typography>
              <Typography variant="small" color="blue-gray" className="text-gray-500">
                {locale === "ar" ? `${currency} ${item.price}` : `${currency} ${item.price}`}
              </Typography>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2 w-1/4">
              <Button
                variant="outlined"
                onClick={() => decrementQty(item.cart_id)}
                size="sm"
                className="p-1 rounded-full"
                style={{ width: "30px", height: "30px" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                </svg>
              </Button>
              <Typography variant="small" color="dark">
                {qtyMap[item.cart_id]}
              </Typography>
              <Button
                onClick={() => incrementQty(item.cart_id)}
                variant="outlined"
                size="sm"
                className="p-1 rounded-full"
                style={{ width: "30px", height: "30px" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="bg-gray-100 p-4 rounded-t-lg shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <Typography variant="small" color="gray">
            {locale === "ar" ? "الإجمالي الجزئي" : "Subtotal"}
          </Typography>
          <Typography variant="small" color="gray">
            {locale === "ar" ? `${currency} ${subTotal}` : `${currency} ${subTotal}`}
          </Typography>
        </div>
        <div className="flex justify-between items-center mb-2">
          <Typography variant="small" color="gray">
            {locale === "ar" ? "رسوم التوصيل" : "Delivery Fee"}
          </Typography>
          <Typography variant="small" color="gray">
            {locale === "ar" ? `${currency} ${delivery}` : `${currency} ${delivery}`}
          </Typography>
        </div>
        {discountValue > 0 && (
          <div className="flex justify-between items-center mb-2">
            <Typography variant="small" color="green">
              {locale === "ar" ? "الخصم" : "Discount"}
            </Typography>
            <Typography variant="small" color="green">
              {locale === "ar" ? `- ${currency} ${discountValue}` : `- ${currency} ${discountValue}`}
            </Typography>
          </div>
        )}
        <div className="flex justify-between items-center border-t border-gray-200 pt-2">
          <Typography variant="medium" color="blue-gray" className="font-bold">
            {locale === "ar" ? "الإجمالي" : "Total"}
          </Typography>
          <Typography variant="medium" color="blue-gray" className="font-bold">
            {locale === "ar" ? `${currency} ${discountedTotal}` : `${currency} ${discountedTotal}`}
          </Typography>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="p-4 bg-white shadow-md">
        <Button
          variant="gradient"
          size="lg"
          className="w-full text-center"
          onClick={placeOrderHandler}
          disabled={restStatus === "offline"}
        >
          {locale === "ar" ? "إتمام الشراء" : "Checkout"}
        </Button>
      </div>
    </>
  )}
</Card>

  
  
  );
}

export default SidebarWithSearch;
