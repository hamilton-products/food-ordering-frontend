"use client";
import Navbar from "@/components/navbar";
import { Avatar, Typography } from "@material-tailwind/react";

function Hero({ restaurantDetails }) {
  const cover_photo = restaurantDetails?.cover_photo || "";
  const logo = restaurantDetails.logo || "";
  const description =
    restaurantDetails.description && restaurantDetails.description.EN;

  const name = restaurantDetails.name && restaurantDetails.name.EN;

  const address = restaurantDetails.address;

  const contactInfo = restaurantDetails.mobile;

  const contactInfoCountryCode = restaurantDetails.mobile_country_code;

  const latitude = restaurantDetails.latitude;
  const longitude = restaurantDetails.longitude;

  return (
    <div
      className="relative h-[calc(100vh-3rem)] w-full bg-cover bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url('${cover_photo}')` }}
    >
      {/* Ensure Navbar is above the overlay */}
      <div className="relative z-20 w-full">
        <Navbar />
      </div>
      <div className="absolute inset-0 h-full w-full  opacity-50 z-10" />
      <div className="grid h-full">
        {/* <div className="container relative z-30 m-auto grid place-items-center text-center px-8">
          <Typography
            variant="h1"
            color="dark"
            className="mt-6 mb-10 md:max-w-full lg:max-w-3xl"
          >
            {name}
          </Typography>
          <div>
            <Avatar src={logo} alt="avatar" size="xxl" />
          </div>
          <Typography variant="h2" color="dark" className="mt-6">
            {description}
          </Typography>
          <Typography variant="body1" color="dark" className="mt-2">
            {address}
          </Typography>
          <Typography variant="body1" color="dark" className="mt-2">
            {contactInfoCountryCode} {contactInfo}
          </Typography>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
            target="_blank"
            className="text-dark underline mt-2"
          >
            View on Map
          </a>
        </div> */}
      </div>
    </div>
  );
}

export default Hero;
