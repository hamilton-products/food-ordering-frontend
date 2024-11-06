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
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
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
import { deleteCart, updateCart } from "@/pages/api/hello";
import axios from "axios";
import Cookies from "js-cookie";

function SidebarWithSearch({ pastOrderList, currentOrderList }) {
  const [activeTab, setActiveTab] = React.useState("current");
  const data = [
    {
      label: "Current Orders",
      value: "current",
      desc: currentOrderList,
    },
    {
      label: "Past Orders",
      value: "past",
      desc: pastOrderList,
    },
  ];
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} ${formattedTime}`;
  };
  const router = useRouter();
  console.log(pastOrderList, "pastOrderList");

  return (
    <Card className="h-[calc(100vh)] w-full max-w-full sm:max-w-[30rem] sm:min-w-[30rem] md:max-w-[40rem] md:min-w-[40rem] lg:max-w-[40rem] lg:min-w-[40rem]p-4 shadow-xl shadow-blue-gray-900/5 overflow-y-auto rounded-none"
    style={{
      background: "#F4F5F5",
      scrollbarWidth: "none", 
      msOverflowStyle: "none", 
    }}>
      <div className="mb-2 flex items-center justify-center gap-4 p-4">
        {/* <img
          src="https://docs.material-tailwind.com/img/logo-ct-dark.png"
          alt="brand"
          className="h-8 w-8"
        /> */}
        <Typography variant="h5" color="blue-gray">
          Orders
        </Typography>
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-x-1 gap-y-5 md:grid-cols-1 xl:grid-cols-1">
        {/* {cartDetails.map((category, categoryIndex) => ( */}
        <React.Fragment>
          <Tabs
            value={activeTab}
            onChange={(newValue) => setActiveTab(newValue)}
          >
            <TabsHeader>
              {data.map(({ label, value }) => (
                <Tab key={value} value={value}>
                  {label}
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody>
              {data.map(({ value, desc }) => (
                <TabPanel key={value} value={value}>
                  {desc.map((item, itemIndex) => (
                    <Card
                      key={itemIndex}
                      className="w-full max-w-[48rem] flex-row mb-4 p-5 cursor-pointer hover:shadow-xl transition duration-300 ease-in-out"
                      onClick={() => {
                        router.push(`/order?orderId=${item.order_id}`);
                      }}
                    >
                      <CardHeader
                        shadow={true}
                        floated={false}
                        className="m-0 w-2/5 shrink-0 rounded-r-none rounded-lg"
                      >
                        <img
                          src={item.logo}
                          alt="card-image"
                          className="h-full w-full object-cover "
                        />
                      </CardHeader>

                      <CardBody>
                        <div className="flex items-center justify-between">
                          <Typography
                            variant="small"
                            color="gray"
                            className="mb-4 uppercase mr-5"
                          >
                            {item.created_at}
                          </Typography>

                          <Typography
                            variant="small"
                            color="gray"
                            className="mb-4 uppercase"
                          >
                            {item.net_amount} {""}
                            {item.currency}
                          </Typography>
                        </div>
                        <Typography
                          variant="h6"
                          color="gray"
                          className="mb-4 uppercase"
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          variant="small"
                          color="red"
                          className="uppercase"
                        >
                          {item.status}
                        </Typography>
                      </CardBody>
                    </Card>
                  ))}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </React.Fragment>
        {/* ))} */}
      </div>
    </Card>
  );
}

export default SidebarWithSearch;
