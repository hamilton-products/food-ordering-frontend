import React, { useRef, useState, useEffect } from "react";
import {
  Card,
  Typography,
  Input,
  CardBody,
  Button,
  CardHeader,
  Alert,
} from "@material-tailwind/react";
import {
  ShoppingBagIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SidebarWithSearch({ menu, cartDetails, restaurantDetails }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const restStatus = restaurantDetails.availability_status;
  const currency = restaurantDetails.currency;
  const router = useRouter();
  const [cartItems, setCartItems] = useState(cartDetails);
  const [mobileResponse, setMobileResponse] = useState(true);
  const [mobileXtraSmallResponse, setMobileXtraSmallResponse] = useState(true);
  const { t } = useTranslation("common");

  const categoryRefs = useRef({});
  const scrollContainerRef = useRef(null);

  const filteredMenu = menu.map((category) => ({
    ...category,
    itemDetails: category.itemDetails.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  menu.forEach((category) => {
    if (!categoryRefs.current[category.item_category_id]) {
      categoryRefs.current[category.item_category_id] = React.createRef();
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = scrollContainerRef.current.scrollTop + 100; // Add some offset
      let currentActiveCategory = null;

      Object.entries(categoryRefs.current).forEach(([categoryId, ref]) => {
        if (ref.current && ref.current.offsetTop <= scrollPosition) {
          currentActiveCategory = categoryId;
        }
      });

      if (currentActiveCategory !== activeCategory) {
        setActiveCategory(currentActiveCategory);
      }
    };

    const container = scrollContainerRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeCategory]);

  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    const categoryRef = categoryRefs.current[categoryId];
    if (categoryRef && categoryRef.current) {
      categoryRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <Card
      ref={scrollContainerRef}
      className={`${
        cartItems.length > 0 ? "h-[calc(100vh-5rem)]" : "h-[calc(100vh)]"
      } w-full max-w-[32rem] shadow-xl shadow-blue-gray-900/5 rounded-none overflow-y-auto overflow-x-hidden`}
    >
      <div className="mb-2 flex items-center justify-center gap-4 p-4">
        <Typography
          variant="h5"
          color="blue-gray"
          className="cursor-pointer"
          onClick={() => router.push("/delivery")}
        >
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
      {restStatus === "offline" && (
        <div className="p-2">
          <Alert color="red" className="mb-3">
            Restaurant is currently not accepting orders
          </Alert>
        </div>
      )}

      <div className="sticky-slider">
        <Slider {...settings}>
          {menu.map((category) => (
            <div key={category.item_category_id} className="px-2">
              <Card
                onClick={() => scrollToCategory(category.item_category_id)}
                shadow={true}
                className={`p-3 m-2 cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out ${
                  activeCategory === category.item_category_id
                    ? "bg-gray-900 text-white"
                    : "bg-blue-gray-50"
                }`}
              >
                <Typography
                  variant="small"
                  color={
                    activeCategory === category.item_category_id
                      ? "white"
                      : "black"
                  }
                  className="font-normal uppercase text-center truncate"
                >
                  {category.title}
                </Typography>
              </Card>
            </div>
          ))}
        </Slider>
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-x-1 gap-y-5 md:grid-cols-1 xl:grid-cols-1 p-5">
        {filteredMenu.map((category, categoryIndex) => (
          <React.Fragment key={categoryIndex}>
            <div
              className="mx-3"
              ref={categoryRefs.current[category.item_category_id]}
            >
              <Typography
                variant="h5"
                color="black"
                className="font-normal uppercase text-left"
              >
                {category.title}
              </Typography>
            </div>
            {category.itemDetails.map((item, itemIndex) => (
              <Card
                key={itemIndex}
                color="transparent"
                shadow={true}
                className="flex flex-row items-center"
              >
                <div className="flex-1">
                  <Link href={`/product?itemId=${item.item_id}`}>
                    <CardBody className="p-3 mx-3">
                      <Typography
                        variant="h6"
                        className="mb-2"
                        color="blue-gray"
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="small"
                        className="mb-3 font-normal !text-gray-500"
                      >
                        {item.description.length > 50
                          ? item.description.substring(0, 50) + "..."
                          : item.description}
                      </Typography>
                    </CardBody>
                  </Link>
                  <div className="mb-3 flex flex-row gap-3 mx-3 sm:w-48 px-1">
                    <Button
                      onClick={() =>
                        router.push(`/product?itemId=${item.item_id}`)
                      }
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
                      <span className="absolute right-0 grid h-full w-10 place-items-center mb-1">
                        <ShoppingBagIcon className="absolute left-0 h-5 w-5 text-dark mr-3" />
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="flex-1 mt-6 lg:px-12 md:px-5 sm:px-5 px-5">
                  <CardHeader
                    floated={true}
                    className="mx-0 mt-0 mb-6 lg:h-36 lg:w-auto h-36 w-auto sm:w-auto"
                  >
                    <img
                      src={item.item_data.cover_photo}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </CardHeader>
                </div>
              </Card>
            ))}
          </React.Fragment>
        ))}
      </div>

      {cartItems.length > 0 && (
        <div
          className={
            mobileResponse
              ? "group fixed bottom-5 z-50 overflow-hidden mx-5 m-auto px-3"
              : "group fixed bottom-5 z-50 overflow-hidden mx-5 left-0 right-0 m-auto"
          }
        >
          <Button
            size={mobileXtraSmallResponse ? "lg" : "md"}
            variant="gradient"
            className="flex justify-center items-center gap-24 rounded-full shadow-none"
            fullWidth
            onClick={() => router.push("/cart")}
          >
            <span className="flex items-center">
              {cartItems.reduce((total, item) => total + item.qty, 0)}
            </span>
            <span>Review Order</span>
            <span className="flex items-center">
              {cartItems
                .reduce((total, item) => total + item.price * item.qty, 0)
                .toFixed(2)}{" "}
              {currency}
            </span>
          </Button>
        </div>
      )}
    </Card>
  );
}

export default SidebarWithSearch;
