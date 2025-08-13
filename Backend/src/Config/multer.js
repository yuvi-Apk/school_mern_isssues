import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, join(__dirname, "")),
  filename: (_, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_, file, cb) => {
  const allowed = file.mimetype.startsWith("image/") || file.mimetype === "application/pdf";
  cb(allowed ? null : new Error("Only images and PDFs are allowed"), allowed);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

export default upload;
