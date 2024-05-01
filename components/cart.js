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
  CardHeader,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  ShoppingCartIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { deleteCart, updateCart } from "@/pages/api/hello";
import axios from "axios";
import Cookies from "js-cookie";

function SidebarWithSearch({ cartDetails }) {
  console.log(cartDetails, "menushsg");
  const router = useRouter();
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);
  const [cartItems, setCartItems] = React.useState(cartDetails);
  console.log(cartItems, "cartItems");

  console.log(cartItems, "cartItems");

  const [cartExits, setCartExists] = React.useState(true);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

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
        `http://localhost:9956/api/cart/list-cart-items/${idToUse}/${consumerType}/EN`
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

  const incrementQty = (cartId) => {
    const updatedQtyMap = { ...qtyMap };
    updatedQtyMap[cartId] = (updatedQtyMap[cartId] || 0) + 1;
    setQtyMap(updatedQtyMap);
    updateCartDetails(cartId, updatedQtyMap[cartId]);
  };

  const decrementQty = (cartId) => {
    const updatedQtyMap = { ...qtyMap };
    if (updatedQtyMap[cartId] > 1) {
      updatedQtyMap[cartId] -= 1;
      setQtyMap(updatedQtyMap);
      updateCartDetails(cartId, updatedQtyMap[cartId]);
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
    if (addressId) {
      router.push("/checkout");
    } else {
      router.push("/address");
    }
  };

  const addMoreItemHandler = () => {
    router.push("/");
  };

  return (
    <Card className="h-[calc(100vh-5rem)] w-full max-w-[32rem] p-4 shadow-xl shadow-blue-gray-900/5 overflow-y-auto rounded-none">
      <div className="absolute z-10 mt-1">
        <Button color="dark" variant="text">
          <ArrowLeftIcon className="h-8 w-8" />
        </Button>
      </div>
      <div className="mb-2 flex items-center justify-center gap-4 p-4">
        {/* <img
          src="https://docs.material-tailwind.com/img/logo-ct-dark.png"
          alt="brand"
          className="h-8 w-8"
        /> */}

        <Typography variant="h5" color="blue-gray">
          Cart
        </Typography>
      </div>
      <div className="border-t-2 border-blue-gray-200 mb-3"></div>
      <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-1 xl:grid-cols-1">
        {/* {cartDetails.map((category, categoryIndex) => ( */}
        {cartItems.length > 0 ? (
          <React.Fragment>
            {cartItems.map((item, itemIndex) => (
              <Card
                key={itemIndex}
                color="transparent"
                shadow={true}
                className="flex flex-row items-center"
              >
                <div className="flex-1 mr-6 mt-6 ">
                  <CardHeader floated={true} className="mx-0 mt-0 mb-3 h-28">
                    <Image
                      width={256}
                      height={256}
                      src={item.item_cover_photo}
                      alt={item.item_name}
                      className="h-full w-full object-cover "
                    />
                  </CardHeader>
                </div>

                {/* <div className="mb-3 absolute top-2 right-2 flex items-center justify-center">
                <Button
                  variant="text"
                  size="sm"
                  className="rounded-full p-2"
                  onClick={() => handleDeleteCart(item.cart_id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div> */}

                <div className="flex-1">
                  <CardBody className="p-2">
                    <Typography
                      style={{ fontSize: "small" }}
                      variant="h6"
                      color="blue-gray"
                      className="mb-5 "
                    >
                      {item.item_name}
                    </Typography>

                    {/* <Typography className="mb-3 font-normal !text-gray-500 ">
                    {item.item_ingredients.length > 40
                      ? item.item_ingredients.substring(0, 40) + "..."
                      : item.item_ingredients}
                  </Typography> */}

                    <Typography
                      style={{ fontSize: "small" }}
                      variant="h6"
                      color="blue-gray"
                      className="mb-3"
                    >
                      KD {item.price}
                    </Typography>
                  </CardBody>
                </div>
                <div className="mb-3 flex flex-row gap-3 mx-3">
                  <Button
                    variant="outlined"
                    //   disabled={qty === 1}
                    onClick={() => decrementQty(item.cart_id)}
                    size="sm"
                    className="rounded-full p-2"
                    style={{ width: "30px", height: "30px" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 44 44"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 12H4"
                      />
                    </svg>
                  </Button>
                  <Typography
                    style={{ fontSize: "small" }}
                    variant="h6"
                    color="black"
                    className="mt-1"
                  >
                    {qtyMap[item.cart_id]}
                  </Typography>
                  <Button
                    style={{ width: "30px", height: "30px" }}
                    onClick={() => incrementQty(item.cart_id)}
                    variant="outlined"
                    size="sm"
                    className="rounded-full p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 44 44"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </Button>
                </div>

                <div className="group fixed bottom-5 z-50 overflow-hidden mx-5 flex justify-between">
                  <Button
                    size="lg"
                    variant="outlined"
                    color="blue-gray"
                    className="flex justify-center items-center gap-48 rounded-full px-16"
                    onClick={addMoreItemHandler}
                  >
                    <span>Add Items</span>
                  </Button>
                  <Button
                    size="lg"
                    variant="gradient"
                    className="flex justify-center items-center gap-48 rounded-full px-16 mx-2"
                    onClick={placeOrderHandler}
                  >
                    <span>Checkout</span>
                    {/* <span className="flex items-center">KD {price * qty}</span> */}
                  </Button>
                </div>
              </Card>
            ))}

            <div className="border-t-2 border-blue-gray-50"></div>
            <div className="flex flex-row justify-between items-center">
              <Typography variant="small" color="blue-gray">
                Subtotal:
              </Typography>

              <span className="flex items-center">
                KD{" "}
                {cartItems.reduce(
                  (total, item) => total + item.price * qtyMap[item.cart_id],
                  0
                )}
              </span>
            </div>

            <div className="border-t-2 border-blue-gray-50"></div>
            <div className="flex flex-row justify-between items-center">
              <Typography variant="small" color="blue-gray">
                Delivery Services:
              </Typography>

              <span className="flex items-center">
                KD{" "}
                {cartItems.reduce(
                  (total, item) => total + item.price * qtyMap[item.cart_id],
                  0
                )}
              </span>
            </div>
            <div className="border-t-2 border-blue-gray-50"></div>
            <div className="flex flex-row justify-between items-center">
              <Typography variant="h6" color="blue-gray">
                Total:
              </Typography>

              <Typography
                variant="h6"
                color="blue-gray"
                className="flex items-center"
              >
                KD{" "}
                {cartItems.reduce(
                  (total, item) => total + item.price * qtyMap[item.cart_id],
                  0
                )}
              </Typography>
            </div>

            <div className="border-t-2 border-blue-gray-50"></div>
          </React.Fragment>
        ) : (
          <div className="mb-2 flex flex-col items-center justify-center gap-4 pt-4 sm:pt-8 md:pt-12 lg:pt-16 xl:pt-20">
            <div className="p-2">
              <ShoppingBagIcon className="h-20 w-20" />
            </div>
            <Typography variant="h5" color="blue-gray">
              No Items in Cart
            </Typography>
          </div>
        )}
        {/* ))} */}
      </div>
    </Card>
  );
}

export default SidebarWithSearch;
