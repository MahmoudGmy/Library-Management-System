const connection = require('../config/db')


const getallbooks = async () => {
    try {
        const [books] = await connection.query(
            `select * from book`
        )

        return books;
    }
    catch (e) {
        console.log("Error=> ", e)
        return null;
    }
}





const getonebook = async (bookId) => {
    try {
        const [book] = await connection.query(
            `select * from book where book_id=?`, [bookId]
        )

        return book[0];
    }
    catch (e) {
        console.log("Error=> ", e)
        return null;
    }
}


const addNewBook = async (req) => {
    try {
        // Destructure the request body
        console.log("Request Body:", req.body);
        const { title, count, author, category, description, image } = req.body;

        // Validate incoming data
        // if (!title || !count || !author || !category || !description ||!image ) {
        //     throw new Error("All fields are required");
        // }

        // Perform the insert query
        const [result] = await connection.query(`
            INSERT INTO book(title, count, author, category, description_of_book, image) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [title, count, author, category, description, image]);

        // Check if the insertion was successful
        if (!result.insertId) {
            throw new Error("Failed to insert the book into the database");
        }

        // Fetch the newly added book
        const [newBook] = await connection.query('SELECT * FROM book WHERE book_id = ?', [result.insertId]);

        // Check if book data was returned
        if (newBook.length === 0) {
            throw new Error("Book not found after insertion");
        }

        // Return the newly added book
        return newBook[0];

    } catch (e) {
        console.error("Cannot add New Book:", e.message);
        return null;
    }
};

const deleteBook = async (req) => {
    const bookId = req.params.Id;

    try {
        const deletedBook =await connection.query(
            `delete from book where book_id=?`, [bookId]
        )

        return true;
    }
    catch (e) {
        console.error("Cannot delete Book", { e });
        return null;
    }
    
}
const borrow = async (req) => {
    const { member_id, book_id } = req.body;

    if (!member_id || !book_id) {
        throw new Error('Both member_id and book_id are required');
    }

    const borrowDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(borrowDate.getDate() + 7);

    // const connection = await pool.getConnection();
    try {
        // await connection.beginTransaction();

        // Check if the book is already borrowed by this member
        // const [existingBorrow] = await connection.query(
        //     `SELECT * FROM borrow WHERE book_id = ? AND member_id = ? AND return_date IS NULL`,
        //     [book_id, member_id]
        // );

        // if (existingBorrow.length > 0) {
        //     throw new Error('Book is already borrowed and not yet returned.');
        // }

        // Proceed with borrowing the book
        const [result] = await connection.query(
            `INSERT INTO borrow (member_id, book_id, fines_id, borrow_date, return_date) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                member_id,
                book_id,
                null,
                borrowDate.toISOString().slice(0, 19).replace('T', ' '),
                returnDate.toISOString().slice(0, 19).replace('T', ' ')
            ]
        );

        // Fetch current count of the book
        const [book] = await connection.query(
            `SELECT count FROM book WHERE book_id = ?`,
            [book_id]
        );

        if (!book.length) throw new Error('Book not found');

        const currentCount = book[0].count;

        if (currentCount > 0) {
            await connection.query(
                `UPDATE book SET count = ? WHERE book_id = ?`,
                [currentCount - 1, book_id]
            );
        } else {
            throw new Error('Book is out of stock');
        }

        // await connection.commit();

        // Return borrow details
        const [borrowBook] = await connection.query(
            `SELECT b.borrow_id, m.name_member, b.borrow_date, b.return_date, bk.title AS book_title
             FROM borrow b
             JOIN members m ON b.member_id = m.member_id
             JOIN book bk ON b.book_id = bk.book_id
             WHERE b.member_id = ? AND b.book_id = ? and return_date is not null`,
            [member_id, book_id]
        );

        return borrowBook[0];
    } catch (error) {
        // await connection.rollback();
        throw error;
    } 
    // finally {
    //     connection.release();
    // }
};

//delete boofrom borrow 
const deleteBorrowBook = async (req) => {
    const bookId = req.params.Id;

    try {
        const deletedBook =await connection.query(
            `delete from book where book_id=?`, [bookId]
        )

        return true;
    }
    catch (e) {
        console.error("Cannot delete Book", { e });
        return null;
    }
    
}
//return book
const returnBook = async (req, res) => {
    const bookId = req.params.Id; 
    const { memberId } = req.body; 

    if (!memberId) {
        return res.status(400).json({ message: "Member ID is required" });
    }

    try {
        const [rows] = await connection.query(
            'SELECT count FROM book WHERE book_id = ?',
            [bookId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        let currentCount = rows[0].count;

        const newCount = currentCount + 1;

        await connection.promise().query(
            'UPDATE book SET count = ? WHERE book_id = ?',
            [newCount, bookId]
        );

        const [deleteResult] = await connection.promise().query(
            'DELETE FROM borrow WHERE book_id = ? AND member_id = ?',
            [bookId, memberId]
        );

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: "No borrow record found for this member and book" });
        }

        console.log(`Book ID ${bookId} count updated to ${newCount} and borrow record deleted for member ${memberId}`);
        res.status(200).json({
            message: "Book returned successfully!",
            newCount: newCount
        });

    } catch (error) {
        console.error("Error returning book:", error);
        res.status(500).json({ message: "Failed to return the book" });
    }
};



module.exports = {
    getallbooks,
    getonebook, addNewBook, deleteBook,
    borrow,returnBook
}