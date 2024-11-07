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
  // if(!restaurantDetails) return null;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const restStatus = restaurantDetails.availability_status;
  const currency = restaurantDetails.currency;
  const router = useRouter();
  const [cartItems, setCartItems] = useState(cartDetails);
  const [mobileResponse, setMobileResponse] = useState(true);
  const [mobileXtraSmallResponse, setMobileXtraSmallResponse] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation("common");

  const categoryRefs = useRef({});
  const scrollContainerRef = useRef(null);
  const sliderRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024); // Set breakpoint for desktop at 1024px
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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

        // Move the slider to show the current active category
        const activeCategoryIndex = menu.findIndex(
          (category) => category.item_category_id === currentActiveCategory
        );
        if (sliderRef.current) {
          const slidesToShow = 3; // Number of slides visible
          const totalSlides = menu.length; // Total number of categories

          // Calculate the target index for the slider to go to
          let targetIndex = activeCategoryIndex;
          if (currentIndex > activeCategoryIndex) {
            targetIndex = Math.max(activeCategoryIndex - 2, 0); // Ensure targetIndex is not negative
          } else if (currentIndex === activeCategoryIndex) {
            targetIndex = Math.max(activeCategoryIndex - 1, 0); // Adjust if the current index is the target
          } // No else needed, targetIndex is set to activeCategoryIndex by default

          // Go to the calculated slide, ensuring it's within bounds
          sliderRef.current.slickGoTo(
            Math.min(targetIndex, totalSlides - slidesToShow)
          );
          setCurrentIndex(activeCategoryIndex);
        }
      }
    };

    const container = scrollContainerRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeCategory, currentIndex, menu]);

  const scrollToCategory = (categoryId, index) => {
    // setActiveCategory(categoryId);
    const categoryRef = categoryRefs.current[categoryId];
    if (categoryRef && categoryRef.current) {
      categoryRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Move the slider to show the next set of categories
    if (sliderRef.current) {
      console.log(sliderRef.current, "sliderRef.current");
      const slidesToShow = 3; // Number of slides visible
      const totalSlides = menu.length; // Total number of categories
      console.log(totalSlides, "totalSlides");
      console.log(index, "index");
      setCurrentIndex(index);

      // Calculate the target index for the slider to go to
      let targetIndex = index;
      if (currentIndex > index) {
        targetIndex = Math.max(index - 2, 0); // Ensure targetIndex is not negative
      } else if (currentIndex === index) {
        targetIndex = Math.max(index - 1, 0); // Adjust if the current index is the target
      } // No else needed, targetIndex is set to index by default

      // Go to the calculated slide, ensuring it's within bounds
      sliderRef.current.slickGoTo(
        Math.min(targetIndex, totalSlides - slidesToShow)
      );
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
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
          initialSlide: 2,
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  console.log(menu[0], "menucheck");
  return (
    <Card
      ref={scrollContainerRef}
      className={`${
        cartItems.length > 0 ? "h-[calc(100vh-5rem)]" : "h-[calc(100vh)]"
      } w-full max-w-full sm:max-w-[30rem] sm:min-w-[30rem] md:max-w-[40rem] md:min-w-[40rem] lg:max-w-[40rem] lg:min-w-[40rem] shadow-xl shadow-blue-gray-900/5 rounded-none overflow-y-auto overflow-x-hidden`}
      style={{
        background: "#F4F5F5",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* <div className="mb-2 flex items-center justify-center gap-4 p-4">
        <Typography
          variant="h5"
          color="blue-gray"
          className="cursor-pointer"
          onClick={() => router.push("/delivery")}
        >
          {t("ReviewOrder")}
        </Typography>
      </div> */}
      <div className="p-2 ">
        <Input
          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          label="Search"
          value={searchQuery}
          className="bg-white"
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
        <Slider ref={sliderRef} {...settings} style={{ background: "#F4F5F5" }}>
          {menu.map((category, index) => (
            <div key={category.item_category_id} className="px-1 md:px-2">
              <Card
                onClick={() =>
                  scrollToCategory(category.item_category_id, index)
                }
                shadow={true}
                className={`p-4 md:p-5 m-2 cursor-pointer transition-transform duration-300 ease-in-out rounded-lg border flex justify-center ${
                  activeCategory === category.item_category_id
                    ? "bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg"
                    : "bg-white hover:shadow-md hover:bg-gray-100"
                }`}
              >
                {/* Optional: Add an Icon or Image */}
                {/* <div className="flex justify-center items-center mb-3">
               <img
                 src={category.icon || '/placeholder-icon.png'}
                 alt={category.title}
                 className="h-12 w-12 object-contain"
               />
             </div> */}

                <Typography
                  variant="small"
                  color={
                    activeCategory === category.item_category_id
                      ? "white"
                      : "blue-gray-700"
                  }
                  className="font-semibold uppercase text-center truncate"
                >
                  {category.title}
                </Typography>
              </Card>
            </div>
          ))}
        </Slider>
      </div>

      <div
        className="container mx-auto p-5 h-full overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {filteredMenu.map((category, categoryIndex) => (
          <React.Fragment key={categoryIndex}>
            <div
              className="relative mx-2 my-4 p-4 rounded-lg shadow-lg"
              style={{
                background: "linear-gradient(270deg, #b28850, #7a5d2f)",
              }}
              ref={categoryRefs.current[category.item_category_id]}
            >
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-20 bg-[url('/pattern.svg')] bg-cover bg-center rounded-lg pointer-events-none"></div>

              {/* Title */}
              <Typography
                variant="h6"
                color="white"
                className="relative z-10 font-extrabold uppercase text-left tracking-wide drop-shadow-lg"
              >
                {category.title}
              </Typography>

              {/* Decorative Accent */}
              <div className="relative z-10 mt-2 flex items-center">
                <div className="w-10 h-1 bg-amber-300 rounded-full"></div>
                <div className="w-4 h-1 bg-amber-100 rounded-full mx-1"></div>
                <div className="w-2 h-1 bg-amber-50 rounded-full"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-1 gap-y-5 md:grid-cols-2 xl:grid-cols-2">
              {category.itemDetails.map((item, itemIndex) => (
                <Link
                  href={`/product?itemId=${item.item_id}`}
                  className="w-full text-center"
                >
                  <Card
                    key={itemIndex}
                    color="transparent"
                    shadow={true}
                    className="flex flex-col justify-between items-center p-4 rounded-lg border border-gray-200 bg-white h-full"
                  >
                    <div className="flex-grow w-full">
                      <CardHeader
                        floated={false}
                        className="w-full h-48 mb-4 mx-0 rounded-lg overflow-hidden"
                      >
                        <img
                          src={item.item_data.cover_photo}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </CardHeader>

                      <CardBody className="px-4">
                        <Typography
                          variant="h6"
                          className="mb-1"
                          color="blue-gray"
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="small"
                          className="mb-3 text-gray-500"
                        >
                          {item.description.length > 50
                            ? item.description.substring(0, 50) + "..."
                            : item.description}
                        </Typography>
                      </CardBody>
                    </div>
                    <div className="flex items-center justify-between w-full px-4 mb-4 flex-col md:flex-row lg:flex-row">
                      <Typography
                        variant="h6"
                        className="text-primary font-semibold"
                      >
                        {item.price} {currency}
                      </Typography>
                      <Button
                        onClick={() =>
                          router.push(`/product?itemId=${item.item_id}`)
                        }
                        size="sm"
                        variant="gradient"
                        className="flex items-center gap-2 px-4 py-1 rounded-lg"
                      >
                        <ShoppingBagIcon className="h-5 w-5 text-dark" />
                        <span>Add</span>
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>

      {cartItems.length > 0 && (
        <div className="group overflow-hidden w-full px-3 ">
          <Button
            size={"lg"}
            variant="gradient"
            className="flex justify-center items-center gap-24 rounded-full shadow-none mx-auto mb-5"
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
