const { default: mongoose } = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number,
  pdfFileId: {
    type: mongoose.Schema.Types.ObjectId, // GridFS'dagi PDF faylga ishora
    default: null,
  },
  pdfFileName: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("PdfBook", bookSchema);
