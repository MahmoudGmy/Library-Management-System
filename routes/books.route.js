

const allowTO = require('../middliewares/allowTO')
const bookController = require('../controllers/books.controller')
const express = require('express')
const verifyToken = require('../middliewares/veryfiyToken')

const router = express.Router();


router.route('/')
    .get(bookController.getBooks)
    .post(verifyToken, allowTO("Admin"), bookController.addBook)


router.route('/:Id')
    .get(bookController.getBookById)
    .delete(verifyToken, allowTO("Admin"), bookController.DeleteBook)

router.route('/return/:Id')
    .get(bookController.getBookById)
    .put(verifyToken, bookController.ReturnBook)



router.route('/borrowBook/:bookId').post(verifyToken, bookController.borrowBook)

module.exports = router;