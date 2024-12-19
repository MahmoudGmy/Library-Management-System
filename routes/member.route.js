const express = require('express')
const router = express.Router()
const memberController = require('../controllers/member.controller')

const allowTO = require('../middliewares/allowTO')
const verifyToken = require('../middliewares/veryfiyToken')
const { route } = require('./books.route')





router.route('/signup')
    .post(memberController.signup)
router.route('/login')
    .post(memberController.login)
    
// router.route('/logout')
//     .post(memberController.logout)




router.route('/:userId/borrowedBooks')
    .get(memberController.getBorrowedBooksCount)

router.route('/:userId/getAllborrowedBooks')
    .get(memberController.getAllborrowedBooks)
    .delete(verifyToken, memberController.ReturnBook)

router.route('/deleteUser')
    .delete(verifyToken, allowTO("Admin"), memberController.deleteUser)
router.route('/Users')
    .get(verifyToken, allowTO("Admin"), memberController.getAllMember)


// add fines to member allow to admin 
router.route("/addFines").post(verifyToken, allowTO("Admin"), memberController.addFines)

module.exports = router;