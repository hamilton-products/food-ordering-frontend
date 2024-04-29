"use client";

import { Avatar, Button, Typography } from "@material-tailwind/react";

function Hero({ restaurantDetails }) {
  console.log(restaurantDetails, "restaurantDetails");
  const cover_photo = restaurantDetails?.cover_photo || "";
  const logo = restaurantDetails.logo || "";
  const description =
    restaurantDetails.description && restaurantDetails.description.EN;
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-no-repeat"
      style={{ backgroundImage: `url('${cover_photo}')` }}
    >
      <div className="absolute inset-0 h-full w-full bg-gray-900/60" />
      <div className="grid min-h-screen px-8">
        <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
          <Typography
            variant="h1"
            color="white"
            className="md:max-w-full lg:max-w-3xl mt-6 mb-10"
          >
            {description}
          </Typography>
          {/* <Typography
                variant="lead"
                color="white"
                className="mt-6 mb-10 w-full md:max-w-full lg:max-w-3xl"
              >
                Our React Course is your gateway to becoming a proficient React
                developer. Learn to build dynamic and interactive web applications
                using one of the most popular JavaScript libraries in the industry.
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
