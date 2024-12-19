const {
  getallbooks,
  getonebook,
  addNewBook,
  deleteBook,
  borrow,
} = require("../models/books");
const Status = require("../utils/Status");

const getBooks = async (req, res) => {
  try {
    const books = await getallbooks();
    res.json({ status: Status.SUCCESS, data: books });
  } catch (e) {
    res.status(500).json({ status: Status.ERROR, message: e.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const bookId = req.params.Id;
    const book = await getonebook(bookId);

    if (book) {
      res.json({ status: Status.SUCCESS, data: { book } });
    } else {
      res
        .status(404)
        .json({ status: Status.FAIL, message: "Book not found", data: null });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: Status.ERROR, message: err.message });
  }
};

const addBook = async (req, res) => {
  try {
    const newBook = await addNewBook(req);

    res.status(201).json({ status: Status.SUCCESS, data: { newBook } });
  } catch (err) {
    res.status(500).json({ status: Status.ERROR, message: err.message });
  }
};

const DeleteBook = async function (req, res) {
  try {
    const result = await deleteBook(req);

    if (result) {
      res.json({ status: Status.SUCCESS, data: null });
    } else {
      res.json({ status: Status.FAIL, data: result.message });
    }
  } catch (e) {
    res.status(500).json({ status: Status.ERROR, message: e.message });
  }
};

const borrowBook = async (req, res) => {
  try {
    const borrowBookData = await borrow(req);
    res.status(201).json({
      status: Status.SUCCESS,
      message: "Book borrowed successfully",
      data: borrowBookData,
    });
  } catch (e) {
    res
      .status(500)
      .json({
        status: Status.FAIL,
        message: "Failed to borrow book from controller",
      });
  }
};

module.exports = {
  getBooks,
  getBookById,
  addBook,
  DeleteBook,

  borrowBook,
  // ReturnBook,

  //borrowBook
  // ReturnBook
};
