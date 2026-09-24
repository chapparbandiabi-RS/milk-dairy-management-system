const sqlite3 = require("sqlite3").verbose();


const db = new sqlite3.Database("./dairy.db", (err) => {

    if (err) {

        console.error(
            "Database connection error:",
            err.message
        );

    } else {

        console.log(
            "SQLite database connected successfully."
        );

    }

});


/* ==========================================
   ACCOUNTS TABLE
   ========================================== */

db.run(`
    CREATE TABLE IF NOT EXISTS accounts (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        contact TEXT NOT NULL UNIQUE,

        email TEXT,

        created_at TEXT NOT NULL

    )
`, (err) => {

    if (err) {

        console.error(
            "Accounts table error:",
            err.message
        );

    } else {

        console.log(
            "Accounts table ready."
        );

    }

});


/* ==========================================
   CUSTOMERS TABLE
   ========================================== */

db.run(`
    CREATE TABLE IF NOT EXISTS customers (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        phone TEXT NOT NULL,

        address TEXT,

        price REAL NOT NULL

    )
`);


/* ==========================================
   ATTENDANCE TABLE
   ========================================== */

db.run(`
    CREATE TABLE IF NOT EXISTS attendance (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        customer_id INTEGER NOT NULL,

        date TEXT NOT NULL,

        status TEXT NOT NULL,

        UNIQUE(customer_id, date),

        FOREIGN KEY(customer_id)
        REFERENCES customers(id)

    )
`);


/* ==========================================
   MILK ENTRIES TABLE
   ========================================== */

db.run(`
    CREATE TABLE IF NOT EXISTS milk_entries (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        customer_id INTEGER NOT NULL,

        date TEXT NOT NULL,

        morning REAL DEFAULT 0,

        evening REAL DEFAULT 0,

        total REAL DEFAULT 0,

        FOREIGN KEY(customer_id)
        REFERENCES customers(id)

    )
`);


/* ==========================================
   PAYMENTS TABLE
   ========================================== */

db.run(`
    CREATE TABLE IF NOT EXISTS payments (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        customer_id INTEGER NOT NULL,

        amount REAL NOT NULL,

        date TEXT NOT NULL,

        FOREIGN KEY(customer_id)
        REFERENCES customers(id)

    )
`);


/* ==========================================
   CHECK / ADD MILK COLUMNS
   FOR EXISTING DATABASE
   ========================================== */

db.all(
    `PRAGMA table_info(milk_entries)`,
    [],
    function(err, columns) {

        if (err) {

            console.log(
                "Milk table check error:",
                err.message
            );

            return;

        }


        const columnNames =
            columns.map(
                column => column.name
            );


        if (
            !columnNames.includes("morning")
        ) {

            db.run(`
                ALTER TABLE milk_entries
                ADD COLUMN morning REAL DEFAULT 0
            `);

        }


        if (
            !columnNames.includes("evening")
        ) {

            db.run(`
                ALTER TABLE milk_entries
                ADD COLUMN evening REAL DEFAULT 0
            `);

        }


        if (
            !columnNames.includes("total")
        ) {

            db.run(`
                ALTER TABLE milk_entries
                ADD COLUMN total REAL DEFAULT 0
            `);

        }

    }
);


/* ==========================================
   EXPORT DATABASE
   ========================================== */

module.exports = db;