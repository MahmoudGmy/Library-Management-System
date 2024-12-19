const connection = require('../config/db')
const bcrypt = require('bcryptjs')

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
}


const getMember = async (email) => {

    try {
        const [members] = await connection.query(
            `select member_id, email, password_hash,name_member,role_user from members where email = ?`, [email]
        )

        return members[0];

    }
    catch (e) {
        console.error("Cannot get Member ", { e });
        return null;
    }


}

const getMemberById = async (id) => {
    try {

        const [member] = await connection.query(` select * from members where member_id =?`, [id])
        return member[0];
    }
    catch (e) {
        console.error("Cannot get Member ", { e });
        return null;
    }
}

const deletemember = async (email) => {
    try {
        const [result] = await connection.query('DELETE FROM members WHERE  email = ?', [email]);
        return result;
    } catch (e) {
        console.error("Error deleting member:", e);
        throw e;
    }
};


const getBorrow = async (req) => {

    const { userId } = req.params;

    try {
        console.log("User ID:", userId)
        const [result] = await connection.query(
            `SELECT COUNT(*) AS count FROM borrow WHERE member_id = ? AND return_date IS NOT NULL`,
            [userId]
        );
        return result[0];

    } catch (e) {
        console.error("Error getting borrow  member:", e);
        throw e;
    }
}

const getAllborrowed = async (req) => {
    const { userId } = req.params;
    console.log(userId);
    try {
        const [result] = await connection.query(`
            SELECT book.book_id ,book.title, book.author,book.image, borrow.borrow_date, borrow.return_date 
            FROM borrow
            INNER JOIN book ON borrow.book_id = book.book_id
            WHERE borrow.member_id = ? AND borrow.return_date IS NOT NULL
        `, [userId]);

    
        return result;
    } catch (e) {
        console.error("Error getting  all borrow  member:", e);
        throw e;
    }
}

const getAll = async () => {
    try {
        const [result] = await connection.query('SELECT * FROM members');
        return result;
    } catch (e) {
        console.error("Error fetching members from the database:", e);
        throw e;
    }
};




//return book
const returnBook = async (req) => {

    const { userId} = req.params;
    const{ book_id } = req.body;

    if (!userId || !book_id) {
        console.error('Missing member_id or book_id');
        return { success: false, message: 'Invalid input data' };
    }

    try {
        // Step 1: Fetch the current count for the book
        // const [rows] = await connection.query(
        //     'SELECT count FROM book WHERE book_id = ?',
        //     [book_id]
        // );

        // // Check if the book exists
        // if (rows.length === 0) {
        //     console.log('Book not found');
        //     return { success: false, message: 'Book not found' };
        // }

        // let currentCount = rows[0].count;
        // const newCount = currentCount + 1;

        // // Step 2: Update the count
        // await connection.query(
        //     'UPDATE book SET count = ? WHERE book_id = ?',
        //     [newCount, book_id]
        // );

        // Step 3: Delete the borrow record
        const [deleteResult] = await connection.query(
            'DELETE FROM borrow WHERE book_id = ? AND member_id = ?',
            [book_id, userId]
        );

        if (deleteResult.affectedRows === 0) {
            console.error('No borrow record found for the given member and book');
            return { success: false, message: 'No borrow record found' };
        }

        // console.log(`Book ID ${book_id} count updated to ${newCount}`);
        return { success: true, message: 'Book returned successfully' };

    } catch (e) {
        console.error('Cannot return Book', e);
        return { success: false, message: 'Internal server error' };
    }
};


module.exports = {
    addMember,
    getMember,
    deletemember,
    getMemberById,
    getAll, getBorrow, getAllborrowed,returnBook


}