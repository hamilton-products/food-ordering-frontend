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

function SidebarWithSearch({ cartDetails }) {
  console.log(cartDetails, "menushsg");
  const router = useRouter();
  const [open, setOpen] = React.useState(0);
  const [openAlert, setOpenAlert] = React.useState(true);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const goToItemDetails = (itemId) => {
    router.push(`/product?itemId=${itemId}`);
  };

  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[30rem] p-4 shadow-xl shadow-blue-gray-900/5 overflow-y-auto">
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
      <div className="p-2">
        <Input
          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          label="Search"
        />
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-1 xl:grid-cols-1">
        {/* {cartDetails.map((category, categoryIndex) => ( */}
        <React.Fragment>
          {cartDetails.map((item, itemIndex) => (
            <Card
              key={itemIndex}
              color="transparent"
              shadow={true}
              className="flex flex-row items-center"
            >
              <div className="flex-1 mr-6 mt-6 ">
                <CardHeader floated={true} className="mx-0 mt-0 mb-3 h-48">
                  <Image
                    width={768}
                    height={768}
                    src={item.item_cover_photo}
                    alt={item.item_name}
                    className="h-full w-full object-cover "
                  />
                </CardHeader>
              </div>
              <div className="flex-1">
                <CardBody className="p-2">
                  <Typography variant="h6" color="blue-gray" className="mb-3">
                    {item.item_name}
                  </Typography>

                  {/* <Typography className="mb-3 font-normal !text-gray-500 ">
                    {item.item_ingredients.length > 40
                      ? item.item_ingredients.substring(0, 40) + "..."
                      : item.item_ingredients}
                  </Typography> */}

                  <Typography variant="paragraph" className="mb-2">
                    KWD {item.price}
                  </Typography>

                  <div className="mb-3 flex flex-row  gap-6">
                    <Button
                      variant="outlined"
                      //   disabled={qty === 1}
                      //   onClick={decrementQty}
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20 12H4"
                        />
                      </svg>
                    </Button>
                    <Typography variant="h6" color="black" className="mt-2">
                      {item.qty}
                    </Typography>
                    <Button
                      //   onClick={incrementQty}
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

                  <div className="-ml-5 flex flex-col justify-center gap-6">
                    <Button
                      variant="gradient"
                      size="lg"
                      className="rounded-full p-3"
                    >
                      Update
                    </Button>
                  </div>

                  {/* <Button
                    onClick={() => goToItemDetails(item.item_id)}
                    size="lg"
                    variant="gradient"
                    className="group relative flex items-center gap-3 overflow-hidden pr-[72px] rounded-full"
                  >
                    {item.price} KD
                    <span className="absolute right-0 grid h-full w-12 place-items-center">
                      <ShoppingBagIcon className="absolute left-0 h-6 w-6 text-white" />
                    </span>
                  </Button> */}
                </CardBody>
              </div>
            </Card>
          ))}
        </React.Fragment>
        {/* ))} */}
      </div>
    </Card>
  );
}

export default SidebarWithSearch;
