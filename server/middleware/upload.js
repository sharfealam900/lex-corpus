import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Only JPEG, PNG, WebP, and GIF images are allowed."
      ),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter,
});

export default upload;