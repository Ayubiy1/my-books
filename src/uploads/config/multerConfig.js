const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Multer = require("multer");

// Faylni diskka emas, xotiraga (RAM buffer) vaqtincha saqlaymiz,
// keyin controller ichida o'zimiz GridFS'ga yozamiz
const storage = Multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Faqat PDF fayl yuklash mumkin!"), false);
  }
};

const upload = Multer({ storage, fileFilter });

module.exports = { upload };

// const uploadDir = path.join(__dirname, "..", "uploads");

// // uploads papkasi yo'q bo'lsa yaratamiz
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName =
//       Date.now() +
//       "-" +
//       Math.round(Math.random() * 1e9) +
//       path.extname(file.originalname);
//     cb(null, uniqueName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "application/pdf") {
//     cb(null, true);
//   } else {
//     cb(new Error("Faqat PDF fayl yuklash mumkin!"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = { upload, uploadDir };
