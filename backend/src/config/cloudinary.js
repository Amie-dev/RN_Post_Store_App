import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_secret: process.env.CLOUDINARY_API_SEC,
  api_key: process.env.CLOUDINARY_API_KEY,
});

export default cloudinary;
