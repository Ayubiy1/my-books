const express = require("express");
const router = express.Router();

const { upload } = require("../uploads/config/multerConfig");
const pdfController = require("../uploads/controllers/pdfController");

/**
 * @swagger
 * /api/pdf/upload/{bookId}:
 *   post:
 *     summary: PDF fayl yuklash va kitobga bog'lash
 *     tags: [PDF]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Fayl muvaffaqiyatli yuklandi
 */
router.post("/upload/:bookId", upload.single("file"), pdfController.uploadPdf);

/**
 * @swagger
 * /api/pdf/book/{bookId}:
 *   get:
 *     summary: Kitobning PDF faylini ko'rish (inline)
 *     tags: [PDF]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF fayl
 */
router.get("/book/:bookId", pdfController.getPdfByBook);

/**
 * @swagger
 * /api/pdf/book/{bookId}/download:
 *   get:
 *     summary: Kitobning PDF faylini yuklab olish
 *     tags: [PDF]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fayl yuklab olindi
 */
router.get("/book/:bookId/download", pdfController.downloadPdfByBook);

/**
 * @swagger
 * /api/pdf/{fileId}:
 *   delete:
 *     summary: PDF faylni o'chirish
 *     tags: [PDF]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fayl o'chirildi
 */
router.delete("/:fileId", pdfController.deletePdf);

module.exports = router;

// const express = require("express");
// const router = express.Router();

// const { upload } = require("../uploads/config/gridfsConfig");
// const pdfController = require("../uploads/controllers/pdfController");

// /**
//  * @swagger
//  * /api/pdf/upload:
//  *   post:
//  *     summary: PDF fayl yuklash (MongoDB GridFS'ga saqlanadi)
//  *     tags: [PDF]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               file:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       200:
//  *         description: Fayl muvaffaqiyatli yuklandi
//  */
// router.post("/upload", upload.single("file"), pdfController.uploadPdf);

// /**
//  * @swagger
//  * /api/pdf/{fileId}:
//  *   get:
//  *     summary: PDF faylni ko'rish (inline)
//  *     tags: [PDF]
//  *     parameters:
//  *       - in: path
//  *         name: fileId
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: PDF fayl
//  */
// router.get("/:fileId", pdfController.getPdf);

// /**
//  * @swagger
//  * /api/pdf/{fileId}/download:
//  *   get:
//  *     summary: PDF faylni yuklab olish
//  *     tags: [PDF]
//  *     parameters:
//  *       - in: path
//  *         name: fileId
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Fayl yuklab olindi
//  */
// router.get("/:fileId/download", pdfController.downloadPdf);

// /**
//  * @swagger
//  * /api/pdf/{fileId}:
//  *   delete:
//  *     summary: PDF faylni o'chirish
//  *     tags: [PDF]
//  *     parameters:
//  *       - in: path
//  *         name: fileId
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Fayl o'chirildi
//  */
// router.delete("/:fileId", pdfController.deletePdf);

// module.exports = router;
