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
            SELECT book.title, book.author,book.image, borrow.borrow_date, borrow.return_date 
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
module.exports = {
    addMember,
    getMember,
    deletemember,
    getMemberById,
    getAll, getBorrow, getAllborrowed


}