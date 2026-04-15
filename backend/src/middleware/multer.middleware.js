import multer from "multer";
import fs from "fs";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp");
//   },
//   filename: function (req, file, cb) {
    
//     cb(null, file.originalname);
//   },
// });
const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });

export const removeLocalFile = async (filePath) => {
  try {
    if (filePath) {
      fs.unlinkSync(filePath);
      console.log(`🧹 Removed file: ${filePath}`);
    }
  } catch (error) {
    console.error(`⚠️ Failed to remove file: ${filePath}`, err.message);
  }
};
