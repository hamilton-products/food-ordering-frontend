import React, { useState } from "react";
import { Typography, Collapse, IconButton, Navbar } from "@material-tailwind/react";
import { Bars3Icon, ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

function NavList() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const { locale } = router;

  const [loading, setLoading] = useState(false);

  const handleLocaleChange = (locale) => {
    setLoading(true);
    window.location.href = locale + router.pathname;
  };

  const handleLinkClick = () => {
    setLoading(true);
  };

  return (
    <ul className="my-2 max-w-screen flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 w-full">
      <Typography
        as="li"
        variant="h6"
        color="blue-gray"
        className="p-2 font-medium bg-white rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </Typography>
      <Link href="/cart" onClick={handleLinkClick}>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-2 font-medium bg-white rounded-md"
        >
          <ShoppingBagIcon className="h-6 w-6 cursor-pointer" strokeWidth={2} />
        </Typography>
      </Link>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-2 font-medium bg-white rounded-md"
      >
        <div onClick={() => handleLocaleChange(locale === "ar" ? "en" : "ar")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 cursor-pointer"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <text
              x="10"
              y="15"
              fontSize="20"
              fontFamily="Arial, sans-serif"
              textAnchor="middle"
              fill="black"
            >
              {locale !== "ar" ? "ع" : "E"}
            </text>
          </svg>
        </div>
      </Typography>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-70 z-50">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8z"
            ></path>
          </svg>
        </div>
      )}
    </ul>
  );
}

function NavbarSimple() {
  const [openNav, setOpenNav] = React.useState(false);

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Navbar style={{ borderRadius: "0px" }}>
      <div className="flex items-center justify-between text-white" style={{ float: "left" }}>
        <Typography
          as="a"
          href="#"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5"
        ></Typography>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </Navbar>
  );
}

export default NavbarSimple;
