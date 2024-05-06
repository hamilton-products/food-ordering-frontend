/** @type {import('next').NextConfig} */
import pkg from "./next-i18next.config.js";
const { i18n } = pkg;

const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "demo.myfatoorah.com",
      "hamilton-talabat.s3.me-south-1.amazonaws.com",
    ],
  },
  i18n,
};

export default nextConfig;
