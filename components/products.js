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
  Rating,
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
import { useTranslation } from "next-i18next";

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

function SidebarWithSearch({ menu, cartDetails, restaurantDetails }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const restStatus = restaurantDetails.availability_status;
  const currency = restaurantDetails.currency;
  console.log(cartDetails, "cartDetails");
  console.log(menu, "menushsg");
  const router = useRouter();
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);

  const [cartItems, setCartItems] = React.useState(cartDetails);
  console.log(cartItems, "cartItems");

  console.log(cartItems, "cartItems");

  const [cartExits, setCartExists] = React.useState(true);
  const [mobileResponse, setMobileResponse] = React.useState(true);

  const [mobileXtraSmallResponse, setMobileXtraSmallResponse] =
    React.useState(true);

  const { locale } = router;

  console.log(locale, "sad");

  const { t, i18n } = useTranslation("common");
  console.log("Current locale:", i18n.language);
  console.log("Translated string for 'ReviewOrder':", t("ReviewOrder"));

  // create a function for screen size for mobile and set in a useState hook

  // create a function for screen size for mobile and set in a useState hook
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 960) {
        setMobileResponse(false);
      } else {
        setMobileResponse(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Function to filter menu items based on search query
  const filteredMenu = menu.map((category) => ({
    ...category,
    itemDetails: category.itemDetails.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  // Function to handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const consumerId = Cookies.get("consumerId");
  const deviceId = Cookies.get("fingerprint");
  let consumerType = "consumer";
  console.log(consumerId, "consumerIdssss");

  if (!consumerId) {
    consumerType = "guest";
  }

  const idToUse = consumerId ? consumerId : deviceId;

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `https://apitasweeq.hamiltonkw.com/api/cart/list-cart-items/${idToUse}/${consumerType}/EN`
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

  console.log(checkCartExists, "checkCartExists");

  return (
    <Card
      className={`${
        checkCartExists ? "h-[calc(100vh-5rem)]" : ""
      } w-full lg:max-w-[32rem] shadow-xl shadow-blue-gray-900/5 overflow-y-auto rounded-none`}
    >
      <div className="mb-2 flex items-center justify-center gap-4 p-4">
        {/* <img
          src="https://docs.material-tailwind.com/img/logo-ct-dark.png"
          alt="brand"
          className="h-8 w-8"
        /> */}
        <Typography variant="h5" color="blue-gray">
          {t("ReviewOrder")}
        </Typography>
      </div>
      <div className="p-2">
        <Input
          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          label="Search"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
      <div className="p-2">
        {restStatus === "offline" && (
          <Alert icon={<Icon />} color="red" className="mb-3">
            Restaurant is currently not accepting orders
          </Alert>
        )}
      </div>
      <div className="flex flex-wrap">
        {menu.map((category, categoryIndex) => (
          <Card
            shadow={true}
            key={categoryIndex}
            className="p-5 mx-5 cursor-pointer"
          >
            <Typography
              variant="small"
              color="black"
              className="font-normal uppercase"
            >
              {category.title}
            </Typography>
          </Card>
        ))}
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-x-1 gap-y-5 md:grid-cols-1 xl:grid-cols-1 p-5">
        {filteredMenu.map((category, categoryIndex) => (
          <React.Fragment key={categoryIndex}>
            {category.itemDetails.map((item, itemIndex) => (
              <Card
                key={itemIndex}
                color="transparent"
                shadow={true}
                className="flex flex-row items-center "
              >
                <div className="flex-1">
                  <Link
                    href={`/product?itemId=${item.item_id}`}
                    key={itemIndex}
                  >
                    <CardBody className="p-3 mx-3">
                      <Typography
                        variant="h6"
                        className="mb-2 "
                        color="blue-gray"
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        variant="small"
                        className="mb-3 font-normal !text-gray-500 "
                      >
                        {item.description.length > 50
                          ? item.description.substring(0, 50) + "..."
                          : item.description}
                      </Typography>
                      {/* <Rating readonly value={item.item_data.avg_rating} /> */}
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

                  <div className="mb-3 flex flex-row gap-3 mx-3 sm:w-48 px-1">
                    <Button
                      onClick={() => goToItemDetails(item.item_id)}
                      size={mobileXtraSmallResponse ? "md" : "sm"}
                      variant="gradient"
                      className="group relative flex items-center gap-3 overflow-hidden pr-[72px] rounded-full"
                    >
                      <span
                        className={`${
                          mobileXtraSmallResponse ? "text-lg" : "text-sm"
                        } mr-auto`}
                      >
                        {item.price}
                      </span>

                      <span
                        className={`${
                          mobileXtraSmallResponse ? "text-lg" : "text-sm"
                        } mr-auto`}
                      >
                        {currency}
                      </span>

                      <span className="absolute right-0 grid h-full w-10 place-items-center mb-1 ">
                        <ShoppingBagIcon className="absolute left-0 h-5 w-5 text-dark mr-3" />
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="flex-1  mt-6 lg:px-12 md:px-5 sm:px-5 px-5 ">
                  <CardHeader
                    floated={true}
                    className="mx-0 mt-0 mb-6 lg:h-36 lg:w-auto h-36  w-auto  sm:w-auto"
                  >
                    <img
                      src={item.item_data.cover_photo}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </CardHeader>
                </div>
                {checkCartExists && (
                  <div
                    className={
                      mobileResponse
                        ? "group fixed bottom-5 z-50 overflow-hidden mx-5  m-auto px-3"
                        : "group fixed bottom-5 z-50 overflow-hidden mx-5 left-0 right-0 m-auto "
                    }
                  >
                    <Button
                      size={mobileXtraSmallResponse ? "lg" : "md"}
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
