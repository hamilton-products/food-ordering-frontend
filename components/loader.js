// components/Loader.js
import React from "react";
import { Spinner } from "@material-tailwind/react";

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";

function Loader() {
  return (
    <Card className="h-[calc(100vh)] w-full max-w-full sm:max-w-[20rem] sm:min-w-[20rem] md:max-w-[30rem] md:min-w-[30rem] lg:max-w-[40rem] lg:min-w-[40rem] p-4 shadow-xl shadow-blue-gray-900/5 rounded-none"
    style={{
      background: "#F4F5F5",
      scrollbarWidth: "none", 
      msOverflowStyle: "none", 
    }}>
      <div className="mt-[50%] flex items-center justify-center gap-4 p-4">
        <Spinner className="h-12 w-12" />
      </div>
    </Card>
  );
}

export default Loader;
