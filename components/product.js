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
import { addToCart } from "@/pages/api/hello";

function Product({ itemDetails }) {
  const img = itemDetails.cover_photo;
  const title = itemDetails.title && itemDetails.title.EN;
  const description = itemDetails.description && itemDetails.description.EN;
  const price = itemDetails.price;
  const [open, setOpen] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const router = useRouter();

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
    router.push("/");
  };

  const productId = itemDetails.item_id;

  const redirectToCart = () => {
    router.push("/cart"); // Redirect to /cart route
  };

  const handleAddToCart = () => {
    try {
      addToCart(productId, qty, redirectToCart);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <Card className="h-[calc(100vh-8rem)] w-full max-w-[30rem] shadow-xl shadow-blue-gray-900/5 rounded-none overflow-y-auto">
      <div className="absolute z-10">
        <Button onClick={() => goToItems()} color="white" variant="text">
          <ArrowLeftIcon className="h-10 w-10" />
        </Button>
      </div>
      <div className="h-92 w-full relative">
        <Image
          width={768}
          height={768}
          src={img}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 mr-6 mt-6">
        <CardBody className="py-2">
          <a
            href="#"
            className="text-blue-gray-900 transition-colors hover:text-gray-800"
          >
            <Typography variant="h6" className="mb-2">
              {title}
            </Typography>
          </a>
          <Typography className="mb-6 font-normal !text-gray-500 ">
            {description}
          </Typography>

          <Typography variant="paragraph" className="mb-2">
            KWD {price}
          </Typography>
        </CardBody>
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
        <div className="mb-6 fixed bottom-14 z-50 flex items-center justify-center gap-4 mx-36">
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
      </div>

      <div className="group fixed bottom-5 z-50 overflow-hidden mx-5">
        <Button
          size="lg"
          variant="gradient"
          className="flex justify-between items-center gap-48 rounded-full"
          onClick={handleAddToCart}
        >
          <span>Add to Cart</span>
          <span className="flex items-center">KWD {price * qty}</span>
        </Button>
      </div>
    </Card>
  );
}

export default Product;
