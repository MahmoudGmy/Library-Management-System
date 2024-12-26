const connection = require("../config/db");
const bcrypt = require("bcryptjs");

const addMember = async (req) => {
  const { name, email, password, phone, gender, address } = req.body;

  // hash password
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const [newMember] = await connection.query(
      `INSERT INTO members (email, password_hash, name_member, phone, gender, address) VALUES (?, ?, ?, ?, ?, ?)`,
      [email, hashPassword, name, phone, gender, address]
    );
    return newMember;
  } catch (e) {
    console.error("Cannot add NewMember ", { e });
    return null;
  }
};

const getMember = async (email) => {
  try {
    const [members] = await connection.query(
      `select member_id, email, password_hash,name_member,role_user from members where email = ?`,
      [email]
    );

    return members[0];
  } catch (e) {
    console.error("Cannot get Member ", { e });
    return null;
  }
};

const getMemberById = async (id) => {
  try {
    const [member] = await connection.query(
      ` select * from members where member_id =?`,
      [id]
    );
    return member[0];
  } catch (e) {
    console.error("Cannot get Member ", { e });
    return null;
  }
};

const deletemember = async (email) => {
  try {


    await connection.query(
      "DELETE FROM borrow WHERE member_id = (SELECT member_id FROM members WHERE email = ?)",
      [email]
    );

    // Delete the member from the 'members' table
    await connection.query("DELETE FROM members WHERE email = ?", [email]);

    // return result;
  } catch (e) {
    console.error("Error deleting member:", e);
    throw e;
  }
};

const getBorrow = async (req) => {
  const { userId } = req.params;

  try {
    console.log("User ID:", userId);
    const [result] = await connection.query(
      `SELECT COUNT(*) AS count FROM borrow WHERE member_id = ? AND return_date IS NOT NULL`,
      [userId]
    );
    return result[0];
  } catch (e) {
    console.error("Error getting borrow  member:", e);
    throw e;
  }
};

const getAllborrowed = async (req) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const [result] = await connection.query(
      `
            SELECT book.book_id ,book.title, book.author,book.image, borrow.borrow_date, borrow.return_date , borrow.fines_value
            FROM borrow
            INNER JOIN book ON borrow.book_id = book.book_id
            WHERE borrow.member_id = ? AND borrow.return_date IS NOT NULL
        `,
      [userId]
    );

    return result;
  } catch (e) {
    console.error("Error getting  all borrow  member:", e);
    throw e;
  }
};

const getAll = async () => {
  try {
    const [result] = await connection.query("SELECT * FROM members");
    return result;
  } catch (e) {
    console.error("Error fetching members from the database:", e);
    throw e;
  }
};

//return book
const returnBook = async (req) => {
  const { userId } = req.params;
  const { book_id } = req.body;

  // const { userId, book_id } = req.body;

  if (!userId || !book_id) {
    console.error("Missing member_id or book_id");
    return { success: false, message: "Invalid input data" };
  }

  try {
 

    // Step 3: Delete the borrow record
    const [deleteResult] = await connection.query(
      "DELETE FROM borrow WHERE book_id = ? AND member_id = ?",
      [book_id, userId]
    );

    if (deleteResult.affectedRows === 0) {
      console.error("No borrow record found for the given member and book");
      return { success: false, message: "No borrow record found" };
    }

    // updaate count ++ after return book
    await connection.query(
      `update book set count = (count+1) where book_id = ?`,
      [book_id]
    );

    return true;
  } catch (e) {
    console.error("Cannot return Book", e);
    return { success: false, message: "Internal server error" };
  }
};



const addfine = async (req) => {
  const { fine_amount } = req.body; // Fine amount from the body
  const { member_id, book_id } = req.params; // UserId and book_id from the URL params

  console.log("Fine Amount:", fine_amount);
  console.log("Member ID:", member_id);
  console.log("Book ID:", book_id);

  try {
    const [result] = await connection.query(
      `UPDATE borrow SET fines_value = ? WHERE member_id = ? AND book_id = ?`,
      [fine_amount, member_id, book_id] // Binding the values to the query
    );

    if (result.affectedRows > 0) {
      const [updatedUser] = await connection.query(
        `SELECT fines_value FROM borrow WHERE member_id = ? AND book_id = ?`,
        [member_id, book_id]
      );
      return updatedUser[0]; // Return true if the update is successful
    } else {
      return false; // No rows affected, so return false
    }
  } catch (e) {
    console.log("Error:", e);
    throw e; // Throw the error if something goes wrong
  }
};

module.exports = {
  addfine,
};
//======================================================================================================

module.exports = {
  addMember,
  getMember,
  deletemember,
  getMemberById,
  getAll,
  getBorrow,
  getAllborrowed,
  returnBook,
  addfine,
};
