const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const members = require("../models/members");
const Status = require("../utils/Status");
const generateToken = require("../utils/generateJWT");

const JWT_SECRET = process.env.JWT_SECRET;
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const member = await members.getMember(email);
    if (!member) {
      return res
        .status(404)
        .json({ status: Status.FAIL, message: "You don't have an account" });
    }

    // Compare password
    const checkPassword = await bcrypt.compare(password, member.password_hash);

    if (!checkPassword) {
      return res.status(401).json({
        status: Status.ERROR,
        message: "Your password or email is not correct",
      });
    }

    const token = generateToken({
      id: member.member_id,
      email: member.email,
      role: member.role_user,
    });
    // console.log(token);
    res.status(200).json({ status: Status.SUCCESS, data: { member, token } });
  } catch (e) {
    res.status(500).json({ status: Status.ERROR, message: e.message });
  }
};

const signup = async (req, res) => {
  try {
    const newMember = await members.addMember(req);

    if (!newMember || !newMember.insertId) {
      return res
        .status(500)
        .json({ status: Status.ERROR, message: "Error inserting new member" });
    }

    const memberDetails = await members.getMemberById(newMember.insertId);

    if (!memberDetails) {
      return res
        .status(404)
        .json({ status: Status.FAIL, message: "Member not found" });
    }

    const payload = {
      id: memberDetails.member_id,
      email: memberDetails.email,
      role: memberDetails.role_user,
    };

    const token = generateToken(payload);

    if (!token) {
      return res
        .status(500)
        .json({ status: Status.ERROR, message: "Token generation failed" });
    }

    res.status(201).json({
      status: "SUCCESS",
      data: {
        newMember: {
          id: memberDetails.member_id,
          name: memberDetails.name_member,
          email: memberDetails.email,
          role: memberDetails.role_user,
          address: memberDetails.address,
          phone: memberDetails.phone,
        },
        token,
      },
    });
  } catch (e) {
    res.status(500).json({ status: Status.ERROR, message: e.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const email = req.body.email;

    await members.deletemember(email);

   

    res
      .status(200)
      .json({ status: Status.SUCCESS, message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ status: Status.ERROR, message: e.message });
  }
};

const getAllMember = async (req, res) => {
  try {
    const Members = await members.getAll();
    if (!Members || Members.length === 0) {
      return res.status(404).json({
        status: "FAIL",
        message: "No members found",
      });
    }

    res.status(200).json({
      status: Status.SUCCESS,
      data: Members,
    });
  } catch (e) {
    res.status(500).json({
      status: Status.ERROR,
      message: "An error occurred while retrieving members",
    });
  }
};

const getBorrowedBooksCount = async (req, res) => {
  try {
    const borrowBookData = await members.getBorrow(req);
    res.status(201).json({
      status: Status.SUCCESS,
      message: "Book borrowed successfully",
      data: {
        count: borrowBookData.count,
      },
    });
  } catch (e) {
    res
      .status(500)
      .json({ status: Status.FAIL, message: "Failed to borrow book" });
  }
};

const getAllborrowedBooks = async (req, res) => {
  try {
    const result = await members.getAllborrowed(req);

    res.status(200).json({
      status: Status.SUCCESS,
      data: result,
    });
  } catch (e) {
    res
      .status(500)
      .json({ status: Status.FAIL, message: "Failed to borrow book" });
  }
};

const ReturnBook = async (req, res) => {
  try {
    const result = await members.returnBook(req);

    if (result) {
      res.json({ status: Status.SUCCESS, data: null });
    } else {
      res.json({ status: Status.FAIL, data: result.message });
    }
  } catch (e) {
    res.status(500).json({ status: Status.ERROR, message: e.message });
  }
};




const addFines = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log request data for debugging
    const updatedFine = await members.addfine(req);
    if (updatedFine) {
      res
        .status(200)
        .json({
          message: "Fine added successfully.",
          fines_value: updatedFine.fines_value,
        });
    } else {
      res.status(400).json({ message: "Failed to add fine." });
    }
  } catch (error) {
    console.error("Error adding fine:", error); // Log error details
    res.status(500).json({ message: "Internal server error.", error });
  }
};
//==========================================================================================


module.exports = {
  signup,
  login,
  deleteUser,
  getAllMember,
  getBorrowedBooksCount,
  getAllborrowedBooks,
  ReturnBook,
  addFines,
};
