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
  CardHeader,
  CardBody,
  ButtonGroup,
  Button,
  Input,
  Checkbox,
  Radio,
  Rating,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { addToCart, checkCart } from "@/pages/api/hello";
import Cookies from "js-cookie";

function Product({ itemDetails, consumerId }) {
  const img = itemDetails.cover_photo;
  const title = itemDetails.title && itemDetails.title.EN;
  const description = itemDetails.description && itemDetails.description.EN;
  const price = itemDetails.price;

  const avg_rating = itemDetails.avg_rating;
  const [open, setOpen] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [cartExits, setCartExists] = React.useState(false);
  console.log(cartExits, "cartExits");

  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const [selectedOption, setSelectedOption] = React.useState(null);

  const [selectedItemOptions, setSelectedItemOptions] = React.useState([]);

  console.log(selectedItemOptions, "selectedItemOptions");

  const [mobileResponse, setMobileResponse] = React.useState(true);

  const itemOption = itemDetails.item_options;

  const handleRadioClick = (value) => {
    setSelectedOption(value);
  };

  console.log(itemDetails, "itemDetails");

  const incrementQty = () => {
    setQty(qty + 1);
  };

  const decrementQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const goToItems = () => {
    router.back();
  };

  const productId = itemDetails.item_id;

  React.useEffect(() => {
    const checkCartExists = async () => {
      try {
        const response = await checkCart(productId);
        console.log(response.exists, "response.exists");
        if (response.exists === true) {
          setCartExists(true);
        }
      } catch (error) {
        console.error("Error checking cart:", error);
      }
    };
    checkCartExists();
  }, []);

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

  // in handleAddToCart first Item is already added to cart or not
  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const response = await checkCart(productId);

      if (response.exists === true) {
        redirectToCart();
      } else {
        // Only add to cart if the item doesn't exist in the cart
        await addToCart(productId, qty, transformedData);
        setCartExists(true);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  const redirectToCart = () => {
    router.push("/cart"); // Redirect to cart route
  };

  const handleStartOrder = () => {
    router.push("/phone");
  };

  // const handleAddToCart = () => {
  //   try {
  //     addToCart(productId, qty, redirectToCart);
  //   } catch (error) {
  //     console.error("Error adding item to cart:", error);
  //   }
  // };

  // create a function to handle the selected item options
  const handleSelectedItemOptions = (optionId, itemId) => {
    const optionIndex = selectedItemOptions.findIndex(
      (option) => option.optionId === optionId
    );

    if (optionIndex !== -1) {
      setSelectedItemOptions((prevOptions) => {
        const updatedOptions = [...prevOptions];
        const itemIndex = updatedOptions[optionIndex].items.indexOf(itemId);

        // If item is already selected, deselect it
        if (itemIndex !== -1) {
          updatedOptions[optionIndex].items.splice(itemIndex, 1);
        } else {
          // If item is not selected, select it
          if (!itemOption[optionIndex].is_multi) {
            updatedOptions[optionIndex].items = [itemId];
          } else {
            updatedOptions[optionIndex].items.push(itemId);
          }
        }
        return updatedOptions;
      });
    } else {
      setSelectedItemOptions((prevOptions) => [
        ...prevOptions,
        { optionId: optionId, items: [itemId] },
      ]);
    }
  };

  const isSelected = (optionId, itemId) => {
    return selectedItemOptions.some(
      (option) => option.optionId === optionId && option.items.includes(itemId)
    );
  };

  // Function to transform selected options
  const transformSelectedOptions = () => {
    const transformedOptions = selectedItemOptions.map((option) => {
      const optionData = itemOption.find(
        (item) => item.item_option_category_id === option.optionId
      );
      const transformedItems = optionData.item_option_list.filter((item) =>
        option.items.includes(item.item_option_id)
      );

      return {
        title_cat: optionData.title_cat,
        status: optionData.status,
        is_multi: optionData.is_multi,
        item_option_category_id: option.optionId,
        item_option_list: transformedItems.map((item) => ({
          item_option_id: item.item_option_id,
          price: item.price,
          status: item.status,
          title: item.title,
        })),
      };
    });

    return transformedOptions;
  };

  const transformedData = transformSelectedOptions();
  console.log(transformedData);

  return (
    <Card
      className={`${
        mobileResponse && cartExits
          ? "h-[calc(100vh-5rem)]"
          : cartExits
          ? "h-[calc(100vh-10rem)]"
          : mobileResponse
          ? "h-[calc(100vh-8rem)]"
          : "h-[calc(100vh-13rem)]"
      } w-full max-w-[40rem] shadow-xl shadow-blue-gray-900/5 rounded-none overflow-y-auto`}
      style={{
        background: "#F4F5F5",
        scrollbarWidth: "none", 
        msOverflowStyle: "none", 
      }}
    >
      <div className="absolute z-10">
        <Button onClick={() => goToItems()} color="white" variant="text">
          <ArrowLeftIcon className="h-10 w-10" />
        </Button>
      </div>
      <div className="w-full relative">
        <Image
          width={768}
          height={768}
          src={img}
          alt={title}
          className="h-full w-full object-cover max-h-[25rem]"
        />
      </div>
      <div className="flex-1 mr-6 mt-6">
        <CardBody className="py-2">
          <Typography variant="h6" className="mb-2">
            {title}
          </Typography>

          <Typography className="mb-6 font-normal !text-gray-500 ">
            {description}
          </Typography>
          <div className="flex justify-between items-center mb-5">
            <Typography variant="h5" color="blue-gray">
              KD {price}
            </Typography>
            <Rating value={avg_rating} readonly />
          </div>
        </CardBody>

        <div className="mb-6 mx-5 flex flex-col gap-6">
          {itemOption.length > 0 &&
            itemOption.map((option, index) => (
              <div key={index}>
                {/* Replace this with the actual JSX you want to render for each option */}

                <Typography variant="h6" color="blue-gray">
                  {option.title_cat.EN}
                  <div className="mb-3 flex flex-col gap-6 mt-3">
                    <Card>
                      {option.item_option_list.length > 0 &&
                        option.item_option_list.map((items, index1) => (
                          <div key={index1}>
                            <CardBody className="flex items-center p-2">
                              {option.is_multi === false ? (
                                <Checkbox
                                  icon={<Radio className="p-1" />}
                                  checked={isSelected(
                                    option.item_option_category_id,
                                    items.item_option_id
                                  )}
                                  onChange={() =>
                                    handleSelectedItemOptions(
                                      option.item_option_category_id,
                                      items.item_option_id
                                    )
                                  }
                                  // I want style checkbox like radio button and remove right tick mark from checkbox
                                  style={{
                                    borderRadius: "50%",
                                    border: "1px solid #6B7280",
                                    // hide the default checkbox tick mark
                                  }}
                                />
                              ) : (
                                <Checkbox
                                  checked={isSelected(
                                    option.item_option_category_id,
                                    items.item_option_id
                                  )}
                                  onChange={() =>
                                    handleSelectedItemOptions(
                                      option.item_option_category_id,
                                      items.item_option_id
                                    )
                                  }
                                />
                              )}
                              <Typography variant="small" color="blue-gray">
                                {items.title.EN}
                              </Typography>

                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="flex items-end ml-auto p-2"
                              >
                                {items.price} KD
                              </Typography>
                            </CardBody>

                            {/* Replace this with the actual JSX you want to render for each option */}
                          </div>
                        ))}
                    </Card>
                  </div>
                </Typography>
              </div>
            ))}
        </div>

        <hr className="my-2 border-blue-gray-200" />

        <div className="mb-6 mx-5 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Special instructions
          </Typography>
          <Input
            size="lg"
            placeholder="Add instructions"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        </div>
      </div>
      {!cartExits && (
        <div
          className={
            mobileResponse
              ? "mb-8 fixed bottom-12 z-50 flex items-center justify-center gap-4 mx-48"
              : "mb-8 fixed bottom-12 z-50 flex items-center justify-center gap-4 mx-32"
          }
        >
          <Button
            variant="outlined"
            disabled={qty === 1}
            onClick={decrementQty}
            size="sm"
            className="rounded-full p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </Button>
          <Typography variant="paragraph">{qty}</Typography>
          <Button
            onClick={incrementQty}
            variant="outlined"
            size="sm"
            className="rounded-full p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
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
      )}

      <div
        className={
          mobileResponse
            ? "group fixed bottom-2 z-50 overflow-hidden mx-5  m-auto px-5"
            : "group fixed bottom-2 z-50 overflow-hidden mx-5 left-0 right-0 m-auto "
        }
      >
        {cartExits ? (
          <Button
            size="lg"
            variant="gradient"
            className={
              mobileResponse
                ? "flex justify-center items-center gap-48 rounded-full px-40"
                : "flex justify-center items-center gap-32 rounded-full px-10"
            }
            fullWidth
            onClick={handleAddToCart}
          >
            <span>Go to the Cart</span>
          </Button>
        ) : (
          // <Button
          //   // loading={loading ? true : false}
          //   size="lg"
          //   variant="gradient"
          //   className={
          //     mobileResponse
          //       ? "flex justify-between items-center gap-48 rounded-full px-12"
          //       : "flex justify-between items-center gap-24 rounded-full px-12"
          //   }
          //   onClick={handleAddToCart}
          // >
          //   <span className="text-sm">Add to Cart</span>
          //   <span className="flex items-center text-lg">{price * qty} KD</span>
          // </Button>
          <Button
            loading={loading === true ? true : false}
            size="lg"
            variant="gradient"
            className={
              mobileResponse
                ? "flex justify-center items-center gap-48 rounded-full px-12"
                : "flex justify-center items-center gap-20 rounded-full px-10"
            }
            fullWidth
            onClick={handleAddToCart}
          >
            {loading === true ? (
              "Add to Cart"
            ) : (
              <div
                className={
                  mobileResponse
                    ? "flex items-center justify-between gap-48"
                    : "flex items-center justify-between gap-28"
                }
              >
                <span className="text-sm">Add to Cart</span>
                <span className="flex items-center text-lg">
                  {price * qty} KD
                </span>
              </div>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default Product;
