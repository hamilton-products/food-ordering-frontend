/** @type {import('next').NextConfig} */
import pkg from "./next-i18next.config.js";
const { i18n } = pkg;

const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "demo.myfatoorah.com"],
  },
  i18n,
};

export default nextConfig;
