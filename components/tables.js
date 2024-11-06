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
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Tooltip,
  IconButton,
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
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
  MagnifyingGlassIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
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

function SidebarWithSearch({ tableDetails }) {
  console.log(tableDetails, "tableDetails");
  const [mobileResponse, setMobileResponse] = React.useState(true);

  const router = useRouter();

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

  const consumerId = Cookies.get("consumerId");
  const deviceId = Cookies.get("fingerprint");
  let consumerType = "consumer";

  if (!consumerId) {
    consumerType = "guest";
  }

  const idToUse = consumerId ? consumerId : deviceId;

  const handleSelectTable = (table_id) => {
    Cookies.set("tableId", table_id);
  };

  const hanldeBackButton = () => {
    router.back();
  };
  return (
    <Card
      className={` h-[calc(100vh-0rem)]
       w-full max-w-full sm:max-w-[30rem] sm:min-w-[30rem] md:max-w-[40rem] md:min-w-[40rem] lg:max-w-[40rem] lg:min-w-[40rem] p-4 shadow-xl shadow-blue-gray-900/5 overflow-y-auto rounded-none`}
       style={{
        background: "#F4F5F5",
        scrollbarWidth: "none", 
        msOverflowStyle: "none", 
      }}
    >
      <div className="absolute z-10 mt-1">
        <Button color="black" variant="text" onClick={hanldeBackButton}>
          <ArrowLeftIcon className="h-8 w-8 " />
        </Button>
      </div>
      <div className="mb-2 flex items-center justify-center gap-4 p-4">
        {/* <img
          src="https://docs.material-tailwind.com/img/logo-ct-dark.png"
          alt="brand"
          className="h-8 w-8"
        /> */}

        <Typography variant="h5" color="blue-gray">
          Tables
        </Typography>
      </div>
      <div className="border-t-2 border-blue-gray-200 mb-3"></div>
      {/* <div>
        {restStatus === "offline" && (
          <Alert icon={<Icon />} color="red" className="mb-3 ">
            Restaurant is currently not accepting orders
          </Alert>
        )}
      </div> */}
      <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2 xl:grid-cols-2">
        {tableDetails && tableDetails.length > 0 ? (
          tableDetails.map((table, index) => (
            <Card
              key={table.table_id}
              className="w-full max-w-[26rem] shadow-lg"
            >
              <CardHeader floated={false} color="blue-gray">
                <img
                  src="https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt="ui/ux review check"
                />
                <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60 " />
              </CardHeader>

              <CardBody>
                <div className="mb-1 flex items-center justify-between">
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="font-medium"
                  >
                    {table.name}
                  </Typography>
                  <Typography
                    color="blue-gray"
                    className="flex items-center gap-1.5 font-normal"
                  >
                    <UsersIcon className="h-8 w-8" /> {/* User Icon */}
                    {table.number_of_pax}
                  </Typography>
                </div>
              </CardBody>
              <CardFooter className="pt-1">
                <Button
                  onClick={handleSelectTable(table.table_id)}
                  disabled={table.is_available ? false : true}
                  size="lg"
                  color="red"
                  fullWidth={true}
                >
                  Reserve
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="flex items-center justify-center h-96">
            <Typography variant="h6" color="blue-gray">
              No tables available
            </Typography>
          </div>
        )}
      </div>
    </Card>
  );
}

export default SidebarWithSearch;
