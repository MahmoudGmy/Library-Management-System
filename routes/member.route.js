const express = require('express')
const router = express.Router()
const memberController = require('../controllers/member.controller')

const allowTO = require('../middliewares/allowTO')
const verifyToken = require('../middliewares/veryfiyToken')





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



module.exports = router;