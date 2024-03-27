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

function SidebarWithSearch({ menu }) {
  console.log(menu, "menushsg");
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
                  <CardBody className="p-2">
                    <a
                      href="#"
                      className="text-blue-gray-900 transition-colors hover:text-gray-800"
                    >
                      <Typography variant="paragraph" className="mb-2">
                        {item.title}
                      </Typography>
                    </a>
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
                  </CardBody>
                </div>
                <div className="flex-1 mr-6 mt-6">
                  <CardHeader floated={true} className="mx-0 mt-0 mb-6 h-48">
                    <Image
                      width={768}
                      height={768}
                      src={item.item_data.cover_photo}
                      alt={item.title}
                      className="h-full w-full object-cover "
                    />
                  </CardHeader>
                </div>
              </Card>
            ))}
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
}

export default SidebarWithSearch;
