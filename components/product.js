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
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { addToCart, checkCart } from "@/pages/api/hello";
import Cookies from "js-cookie";

function Product({ itemDetails, consumerId }) {
  const router = useRouter();
  const {locale}=router; 
  const img = itemDetails.cover_photo;
  const title = itemDetails.title?(locale=="ar"?itemDetails.title.AR: itemDetails.title.EN):"";
  const description = itemDetails.description?(locale=="ar"?itemDetails.description.AR: itemDetails.description.EN):"";
  const price = itemDetails.price;

  const avg_rating = itemDetails.avg_rating;
  const [open, setOpen] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [cartExits, setCartExists] = React.useState(false);
  // console.log(cartExits, "cartExits");

  const [loading, setLoading] = React.useState(false);


  const [selectedOption, setSelectedOption] = React.useState(null);

  const [selectedItemOptions, setSelectedItemOptions] = React.useState([]);

  // console.log(selectedItemOptions, "selectedItemOptions");

  const [mobileResponse, setMobileResponse] = React.useState(true);

  const itemOption = itemDetails.item_options;

  const handleRadioClick = (value) => {
    setSelectedOption(value);
  };

  // console.log(itemDetails, "itemDetails");

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
        // console.log(response.exists, "response.exists");
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
  // console.log(transformedData);

  return (
  
    <Card
      className={`${
        mobileResponse && cartExits
          ? "h-[calc(100vh)]"
          : cartExits
          ? "h-[calc(100vh)]"
          : mobileResponse
          ? "h-[calc(100vh)]"
          : "h-[calc(100vh)]"
      } w-full max-w-full sm:max-w-[30rem] sm:min-w-[30rem] md:max-w-[40rem] md:min-w-[40rem] lg:max-w-[40rem] lg:min-w-[40rem] shadow-xl shadow-blue-gray-900/5 rounded-none`}
      style={{
        background: "#F4F5F5",
      }}
    >
      {/* Back Button */}
      <div className="absolute z-10 p-1">
        <Button onClick={() => goToItems()} color="black" variant="text">
          <ArrowLeftIcon className="h-7 w-7" />
        </Button>
      </div>

      {/* Image Section */}
      <div className="relative w-full p-5 rounded flex justify-center">
        <Image
          width={250}
          height={250}
          src={img}
          alt={title}
          className="h-full object-cover max-h-[250px] object-center flex rounded aspect-square"
        />
      </div>

      {/* Scrollable Middle Section */}
      <div className="flex-1 mt-6 px-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 20rem)' }}>
        <CardBody className="py-2 grid" style={{gridTemplateColumns:"70% 30%"}}>
          <div>
          <Typography variant="h6" className="mb-2">
            {title}
          </Typography>
          <Typography className="mb-6 font-normal text-gray-500">
            {description}
          </Typography>
          </div>
          <div className="flex justify-between items-center mb-5">
            <Typography variant="h5" color="blue-gray">
              KD {price}
            </Typography>
            {/* <Rating value={avg_rating} readonly /> */}
          </div>
        </CardBody>

        {/* Options Section */}
        <div className="mb-6 flex flex-col gap-6">
          {itemOption.length > 0 &&
            itemOption.map((option, index) => (
              <div key={index}>
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  {option.title_cat.EN}
                </Typography>
                <Card className="p-2">
                  {option.item_option_list.map((items, index1) => (
                    <CardBody key={index1} className="flex items-center p-2">
                      {option.is_multi ? (
                        <Checkbox
                          checked={isSelected(option.item_option_category_id, items.item_option_id)}
                          onChange={() =>
                            handleSelectedItemOptions(option.item_option_category_id, items.item_option_id)
                          }
                        />
                      ) : (
                        <Checkbox
                          icon={<Radio className="p-1" />}
                          checked={isSelected(option.item_option_category_id, items.item_option_id)}
                          onChange={() =>
                            handleSelectedItemOptions(option.item_option_category_id, items.item_option_id)
                          }
                          style={{
                            borderRadius: "50%",
                            border: "1px solid #6B7280",
                            appearance: "none",
                          }}
                        />
                      )}
                      <Typography variant="small" color="blue-gray" className="flex-1 ml-2">
                        {items.title.EN}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="ml-auto p-2">
                        {items.price} KD
                      </Typography>
                    </CardBody>
                  ))}
                </Card>
              </div>
            ))}
        </div>

        {/* Special Instructions */}
        <hr className="my-2 border-blue-gray-200" />
        <div className="mb-6 mx-5 flex flex-col gap-6">
        <Typography variant="h6" color="blue-gray">
          {locale === 'ar' ? 'تعليمات خاصة' : 'Special instructions'}
        </Typography>
          <Input
            size="lg"
            placeholder="Add instructions"
            className="border-t-blue-gray-200 focus:border-t-gray-900"
            labelProps={{ className: "before:content-none after:content-none" }}
          />
        </div>
      </div>

      {/* Quantity Control Buttons */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md flex flex-col items-center gap-4">
        {!cartExits && (
          <div className="flex items-center gap-4">
            <Button
              variant="outlined"
              disabled={qty === 1}
              onClick={decrementQty}
              size="sm"
              className="rounded-full p-2"
            >
              <MinusIcon className="h-5 w-5" />
            </Button>
            <Typography>{qty}</Typography>
            <Button
              onClick={incrementQty}
              variant="outlined"
              size="sm"
              className="rounded-full p-2"
            >
              <PlusIcon className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Add to Cart or Go to Cart Button */}
        <Button
          size="lg"
          variant="gradient"
          className="flex items-center justify-between rounded-full px-8 w-80"
          onClick={handleAddToCart}
        >
        {cartExits ? (
            <span className="mx-auto">
              {locale === 'ar' ? 'الذهاب إلى السلة' : 'Go to the Cart'}
            </span>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-sm">
                {locale === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
              </span>
              <span className="text-lg">
                {price * qty} KD
              </span>
            </div>
          )}

        </Button>
      </div>
    </Card>
  );
}

export default Product;
