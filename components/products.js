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
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";

import { deleteCart, updateCart, addToCart } from "@/pages/api/hello";

function SidebarWithSearch({ menu, cartDetails }) {
  console.log(cartDetails, "cartDetails");
  const consumerId = Cookies.get("consumerId");
  console.log(menu, "menushsg");
  const router = useRouter();
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);

  const [cartItems, setCartItems] = React.useState(cartDetails);
  console.log(cartItems, "cartItems");

  console.log(cartItems, "cartItems");

  const [cartExits, setCartExists] = React.useState(true);
  const [mobileResponse, setMobileResponse] = React.useState(true);

  // create a function for screen size for mobile and set in a useState hook

  // create a function for screen size for mobile and set in a useState hook
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setMobileResponse(false);
      } else {
        setMobileResponse(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9956/api/cart/list-cart-items/${consumerId}/consumer/EN`
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
      console.error("Error updating item from cart:", error);
    }
  };

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const goToItemDetails = (itemId) => {
    router.push(`/product?itemId=${itemId}`);
  };

  const checkCartExists = cartDetails.length > 0 ? true : false;

  return (
    <Card
      className={`h-[calc(100vh${
        checkCartExists ? "-5rem" : ""
      })] w-full max-w-[32rem] p-4 shadow-xl shadow-blue-gray-900/5 overflow-y-auto rounded-none`}
    >
      <div className="mb-2 flex items-center justify-center gap-4 p-4">
        {/* <img
          src="https://docs.material-tailwind.com/img/logo-ct-dark.png"
          alt="brand"
          className="h-8 w-8"
        /> */}
        <Typography variant="h5" color="blue-gray">
          Delivery
        </Typography>
      </div>
      <div className="p-2">
        <Input
          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          label="Search"
        />
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-1 xl:grid-cols-1">
        {menu.map((category, categoryIndex) => (
          <React.Fragment key={categoryIndex}>
            {category.itemDetails.map((item, itemIndex) => (
              <Card
                key={itemIndex}
                color="transparent"
                shadow={true}
                className="flex flex-row items-center"
              >
                <div className="flex-1">
                  <Link
                    href={`/product?itemId=${item.item_id}`}
                    key={itemIndex}
                  >
                    <CardBody className="p-3">
                      <Typography variant="paragraph" className="mb-2">
                        {item.title}
                      </Typography>

                      <Typography className="mb-6 font-normal !text-gray-500 ">
                        {item.description.length > 40
                          ? item.description.substring(0, 40) + "..."
                          : item.description}
                      </Typography>
                      {/* <Button
                      onClick={() => goToItemDetails(item.item_id)}
                      color="gray"
                      variant="gradient"
                      size="lg"
                      className="rounded-full"
                    >
                      {item.price} KD
                    </Button> */}
                    </CardBody>
                  </Link>

                  <div className="mb-3 flex flex-row gap-3 mx-2 sm:w-48">
                    <Button
                      onClick={() => goToItemDetails(item.item_id)}
                      size="lg"
                      variant="gradient"
                      className="group relative flex items-center gap-3 overflow-hidden pr-[72px] rounded-full"
                    >
                      {item.price} KD
                      <span className="absolute right-0 grid h-full w-12 place-items-center">
                        <ShoppingBagIcon className="absolute left-0 h-6 w-6 text-white" />
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="flex-1 mr-3 mt-6 ">
                  <CardHeader floated={true} className="mx-0 mt-0 mb-6 h-48 ">
                    <img
                      src={item.item_data.cover_photo}
                      alt={item.title}
                      className="h-full w-full object-cover "
                    />
                  </CardHeader>
                </div>
                {checkCartExists && (
                  <div className="group fixed bottom-5 z-50 overflow-hidden mx-5">
                    <Button
                      size={mobileResponse ? "lg" : "md"}
                      variant="gradient"
                      className="flex justify-center items-center gap-24 rounded-full  shadow-none"
                      fullWidth
                      onClick={() => router.push("/cart")}
                    >
                      <span className="flex items-center">
                        {cartItems.reduce(
                          (total, item) => total + qtyMap[item.cart_id],
                          0
                        )}{" "}
                      </span>
                      <span>Review Order</span>
                      <span className="flex items-center">
                        {cartItems.reduce(
                          (total, item) =>
                            total + item.price * qtyMap[item.cart_id],
                          0
                        )}{" "}
                        KD
                      </span>
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
}

export default SidebarWithSearch;
