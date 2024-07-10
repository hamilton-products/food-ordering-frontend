"use client";
import Navbar from "@/components/navbar";
import { Avatar, Typography } from "@material-tailwind/react";

function Hero({ restaurantDetails }) {
  const cover_photo = restaurantDetails?.cover_photo || "";
  const logo = restaurantDetails.logo || "";
  const description =
    restaurantDetails.description && restaurantDetails.description.EN;

  return (
    <div
      className="relative h-screen w-full bg-cover bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url('${cover_photo}')` }}
    >
      {/* Ensure Navbar is above the overlay */}
      {/* <div className="relative z-20 w-full">
        <Navbar />
      </div> */}
      <div className="absolute inset-0 h-full w-full  opacity-50 z-10" />
      <div className="grid h-full">
        <div className="container relative z-30 m-auto grid place-items-center text-center px-8">
          {/* <Typography
            variant="h1"
            color="white"
            className="mt-6 mb-10 md:max-w-full lg:max-w-3xl"
          >
            {description}
          </Typography> */}
          <div>
            <Avatar src={logo} alt="avatar" size="xxl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
