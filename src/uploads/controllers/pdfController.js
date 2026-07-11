const mongoose = require("mongoose");
const { Readable } = require("stream");
const { getGfsBucket } = require("../config/gridfsConfig");
const Book = require("../../models/Book.module");

// ---------- PDF SAQLASH VA KITOBGA BOG'LASH ----------
// POST /api/pdf/upload/:bookId
exports.uploadPdf = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Fayl topilmadi" });
  }

  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: "Kitob topilmadi" });
    }

    const gfsBucket = getGfsBucket();

    // Agar avvaldan PDF bo'lsa, eskisini o'chirib tashlaymiz
    if (book.pdfFileId) {
      try {
        await gfsBucket.delete(book.pdfFileId);
      } catch (e) {
        console.log(
          "Eski faylni o'chirishda xatolik (davom etamiz):",
          e.message,
        );
      }
    }

    const filename = `${Date.now()}-${req.file.originalname}`;

    const readableStream = Readable.from(req.file.buffer);
    const uploadStream = gfsBucket.openUploadStream(filename, {
      contentType: "application/pdf",
    });

    await new Promise((resolve, reject) => {
      readableStream
        .pipe(uploadStream)
        .on("error", reject)
        .on("finish", resolve);
    });

    // MUHIM: book.save() o'rniga findByIdAndUpdate ishlatamiz,
    // shunda faqat pdfFileId/pdfFileName tekshiriladi, boshqa (eskirgan) maydonlar emas
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.bookId,
      {
        pdfFileId: uploadStream.id,
        pdfFileName: filename,
      },
      { new: true, runValidators: false },
    );

    res.status(200).json({
      message: "PDF muvaffaqiyatli yuklandi va kitobga bog'landi",
      bookId: updatedBook._id,
      fileId: uploadStream.id,
      filename,
    });
  } catch (err) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  }
};

// ---------- PDF NI KITOB ID ORQALI KO'RISH (inline) ----------
// GET /api/pdf/book/:bookId
exports.getPdfByBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book || !book.pdfFileId) {
      return res.status(404).json({ message: "Bu kitobda PDF mavjud emas" });
    }

    const gfsBucket = getGfsBucket();
    const files = await gfsBucket.find({ _id: book.pdfFileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "Fayl topilmadi" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${files[0].filename}"`,
    );

    const downloadStream = gfsBucket.openDownloadStream(book.pdfFileId);
    downloadStream.pipe(res);

    downloadStream.on("error", () => {
      res.status(404).json({ message: "Fayl o'qishda xatolik" });
    });
  } catch (err) {
    res.status(400).json({ message: "Xatolik", error: err.message });
  }
};

// ---------- PDF NI KITOB ID ORQALI YUKLAB OLISH ----------
// GET /api/pdf/book/:bookId/download
exports.downloadPdfByBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book || !book.pdfFileId) {
      return res.status(404).json({ message: "Bu kitobda PDF mavjud emas" });
    }

    const gfsBucket = getGfsBucket();
    const files = await gfsBucket.find({ _id: book.pdfFileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "Fayl topilmadi" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${files[0].filename}"`,
    );

    const downloadStream = gfsBucket.openDownloadStream(book.pdfFileId);
    downloadStream.pipe(res);

    downloadStream.on("error", () => {
      res.status(404).json({ message: "Fayl o'qishda xatolik" });
    });
  } catch (err) {
    res.status(400).json({ message: "Xatolik", error: err.message });
  }
};

// ---------- PDF NI O'CHIRISH ----------
exports.deletePdf = async (req, res) => {
  try {
    const gfsBucket = getGfsBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    await gfsBucket.delete(fileId);
    res.status(200).json({ message: "Fayl o'chirildi" });
  } catch (err) {
    res.status(404).json({
      message: "Fayl topilmadi yoki o'chirishda xatolik",
      error: err.message,
    });
  }
};

{
  // // ---------- PDF SAQLASH VA KITOBGA BOG'LASH ----------
  // // POST /api/pdf/upload/:bookId
  // exports.uploadPdf = async (req, res) => {
  //   if (!req.file) {
  //     return res.status(400).json({ message: "Fayl topilmadi" });
  //   }
  //   try {
  //     const book = await Book.findById(req.params.bookId);
  //     if (!book) {
  //       return res.status(404).json({ message: "Kitob topilmadi" });
  //     }
  //     const gfsBucket = getGfsBucket();
  //     // Agar avvaldan PDF bo'lsa, eskisini o'chirib tashlaymiz
  //     if (book.pdfFileId) {
  //       try {
  //         await gfsBucket.delete(book.pdfFileId);
  //       } catch (e) {
  //         console.log(
  //           "Eski faylni o'chirishda xatolik (davom etamiz):",
  //           e.message,
  //         );
  //       }
  //     }
  //     const filename = `${Date.now()}-${req.file.originalname}`;
  //     // req.file.buffer - multer memoryStorage orqali kelgan xom fayl ma'lumoti
  //     const readableStream = Readable.from(req.file.buffer);
  //     const uploadStream = gfsBucket.openUploadStream(filename, {
  //       contentType: "application/pdf",
  //     });
  //     // Stream tugashini kutamiz (Promise bilan o'rab olamiz)
  //     await new Promise((resolve, reject) => {
  //       readableStream
  //         .pipe(uploadStream)
  //         .on("error", reject)
  //         .on("finish", resolve);
  //     });
  //     book.pdfFileId = uploadStream.id; // yozilgan faylning ObjectId'si
  //     book.pdfFileName = filename;
  //     await book.save();
  //     res.status(200).json({
  //       message: "PDF muvaffaqiyatli yuklandi va kitobga bog'landi",
  //       bookId: book._id,
  //       fileId: uploadStream.id,
  //       filename,
  //     });
  //   } catch (err) {
  //     res.status(500).json({ message: "Xatolik yuz berdi", error: err.message });
  //   }
  // };
  // // ---------- PDF NI KITOB ID ORQALI KO'RISH (inline) ----------
  // // GET /api/pdf/book/:bookId
  // exports.getPdfByBook = async (req, res) => {
  //   try {
  //     const book = await Book.findById(req.params.bookId);
  //     if (!book || !book.pdfFileId) {
  //       return res.status(404).json({ message: "Bu kitobda PDF mavjud emas" });
  //     }
  //     const gfsBucket = getGfsBucket();
  //     const files = await gfsBucket.find({ _id: book.pdfFileId }).toArray();
  //     if (!files || files.length === 0) {
  //       return res.status(404).json({ message: "Fayl topilmadi" });
  //     }
  //     res.setHeader("Content-Type", "application/pdf");
  //     res.setHeader(
  //       "Content-Disposition",
  //       `inline; filename="${files[0].filename}"`,
  //     );
  //     const downloadStream = gfsBucket.openDownloadStream(book.pdfFileId);
  //     downloadStream.pipe(res);
  //     downloadStream.on("error", () => {
  //       res.status(404).json({ message: "Fayl o'qishda xatolik" });
  //     });
  //   } catch (err) {
  //     res.status(400).json({ message: "Xatolik", error: err.message });
  //   }
  // };
  // // ---------- PDF NI KITOB ID ORQALI YUKLAB OLISH ----------
  // // GET /api/pdf/book/:bookId/download
  // exports.downloadPdfByBook = async (req, res) => {
  //   try {
  //     const book = await Book.findById(req.params.bookId);
  //     if (!book || !book.pdfFileId) {
  //       return res.status(404).json({ message: "Bu kitobda PDF mavjud emas" });
  //     }
  //     const gfsBucket = getGfsBucket();
  //     const files = await gfsBucket.find({ _id: book.pdfFileId }).toArray();
  //     if (!files || files.length === 0) {
  //       return res.status(404).json({ message: "Fayl topilmadi" });
  //     }
  //     res.setHeader("Content-Type", "application/pdf");
  //     res.setHeader(
  //       "Content-Disposition",
  //       `attachment; filename="${files[0].filename}"`,
  //     );
  //     const downloadStream = gfsBucket.openDownloadStream(book.pdfFileId);
  //     downloadStream.pipe(res);
  //     downloadStream.on("error", () => {
  //       res.status(404).json({ message: "Fayl o'qishda xatolik" });
  //     });
  //   } catch (err) {
  //     res.status(400).json({ message: "Xatolik", error: err.message });
  //   }
  // };
  // // ---------- PDF NI O'CHIRISH ----------
  // exports.deletePdf = async (req, res) => {
  //   try {
  //     const gfsBucket = getGfsBucket();
  //     const fileId = new mongoose.Types.ObjectId(req.params.fileId);
  //     await gfsBucket.delete(fileId);
  //     res.status(200).json({ message: "Fayl o'chirildi" });
  //   } catch (err) {
  //     res.status(404).json({
  //       message: "Fayl topilmadi yoki o'chirishda xatolik",
  //       error: err.message,
  //     });
  //   }
  // };
}

{
  // const mongoose = require("mongoose");
  // const { getGfsBucket } = require("../config/gridfsConfig");
  // // ---------- PDF SAQLASH ----------
  // exports.uploadPdf = (req, res) => {
  //   if (!req.file) {
  //     return res.status(400).json({ message: "Fayl topilmadi" });
  //   }
  //   // req.file.id - MongoDB'dagi faylning ObjectId'si (GridFS avtomatik generatsiya qiladi)
  //   res.status(200).json({
  //     message: "Fayl muvaffaqiyatli yuklandi",
  //     fileId: req.file.id,
  //     filename: req.file.filename,
  //   });
  // };
  // // ---------- PDF NI KO'RISH (inline, brauzerda ochiladi) ----------
  // exports.getPdf = async (req, res) => {
  //   try {
  //     const gfsBucket = getGfsBucket();
  //     const fileId = new mongoose.Types.ObjectId(req.params.fileId);
  //     const files = await gfsBucket.find({ _id: fileId }).toArray();
  //     if (!files || files.length === 0) {
  //       return res.status(404).json({ message: "Fayl topilmadi" });
  //     }
  //     res.setHeader("Content-Type", "application/pdf");
  //     res.setHeader(
  //       "Content-Disposition",
  //       `inline; filename="${files[0].filename}"`,
  //     );
  //     const downloadStream = gfsBucket.openDownloadStream(fileId);
  //     downloadStream.pipe(res);
  //     downloadStream.on("error", () => {
  //       res.status(404).json({ message: "Fayl o'qishda xatolik" });
  //     });
  //   } catch (err) {
  //     res.status(400).json({ message: "Noto'g'ri fileId", error: err.message });
  //   }
  // };
  // // ---------- PDF NI YUKLAB OLISH (attachment) ----------
  // exports.downloadPdf = async (req, res) => {
  //   try {
  //     const gfsBucket = getGfsBucket();
  //     const fileId = new mongoose.Types.ObjectId(req.params.fileId);
  //     const files = await gfsBucket.find({ _id: fileId }).toArray();
  //     if (!files || files.length === 0) {
  //       return res.status(404).json({ message: "Fayl topilmadi" });
  //     }
  //     res.setHeader("Content-Type", "application/pdf");
  //     res.setHeader(
  //       "Content-Disposition",
  //       `attachment; filename="${files[0].filename}"`,
  //     );
  //     const downloadStream = gfsBucket.openDownloadStream(fileId);
  //     downloadStream.pipe(res);
  //     downloadStream.on("error", () => {
  //       res.status(404).json({ message: "Fayl o'qishda xatolik" });
  //     });
  //   } catch (err) {
  //     res.status(400).json({ message: "Noto'g'ri fileId", error: err.message });
  //   }
  // };
  // // ---------- PDF NI O'CHIRISH ----------
  // exports.deletePdf = async (req, res) => {
  //   try {
  //     const gfsBucket = getGfsBucket();
  //     const fileId = new mongoose.Types.ObjectId(req.params.fileId);
  //     await gfsBucket.delete(fileId);
  //     res.status(200).json({ message: "Fayl o'chirildi" });
  //   } catch (err) {
  //     res.status(404).json({
  //       message: "Fayl topilmadi yoki o'chirishda xatolik",
  //       error: err.message,
  //     });
  //   }
  // };
}
