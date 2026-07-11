const mongoose = require("mongoose");

let gfsBucket;

const initGfsBucket = () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "pdfs",
  });
  console.log("GridFS bucket tayyor");
};

const getGfsBucket = () => gfsBucket;

module.exports = { initGfsBucket, getGfsBucket };

// const mongoose = require("mongoose");
// const { GridFsStorage } = require("multer-gridfs-storage");
// const multer = require("multer");

// // GridFS storage - fayl bevosita MongoDB'ga yoziladi
// const storage = new GridFsStorage({
//   url: process.env.MONGO_URI,
//   file: (req, file) => {
//     if (file.mimetype !== "application/pdf") {
//       return null; // rad etiladi (fileFilter pastda ham tekshiradi)
//     }
//     return {
//       bucketName: "pdfs", // MongoDB'da "pdfs.files" va "pdfs.chunks" kolleksiyalari yaratiladi
//       filename: `${Date.now()}-${file.originalname}`,
//     };
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

// // GridFSBucket - faylni o'qish/olish uchun kerak bo'ladi
// let gfsBucket;

// const initGfsBucket = () => {
//   gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//     bucketName: "pdfs",
//   });
//   console.log("GridFS bucket tayyor");
// };

// const getGfsBucket = () => gfsBucket;

// module.exports = { upload, initGfsBucket, getGfsBucket };
