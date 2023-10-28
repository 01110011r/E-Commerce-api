import { Pool } from "pg";
import crypto from "../lib/crypto";


export default async () => {
    const db_pass = process.env.DB_PASS;
    const db_name = process.env.DB_NAME;
    const db_user = process.env.DB_USER;
    const admin_name = process.env.ADMIN_NAME || "admin";
    const admin_pass = process.env.ADMIN_PASS || "admin";
    const admin_email = process.env.ADMIN_EMAIL || "super@admin.com";

    const pool = new Pool({
        host: 'localhost',
        user: db_user,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        port: 5432,
        database: db_name,
        password: db_pass
    });





    // super admin add
    const inspect = await pool.query(`select * from users where username=$1`, [admin_name]);
    
    if (inspect.rows.length == 0) {
        const hashpass = await crypto.hash(admin_pass);
        console.log(hashpass);
        pool.query('INSERT INTO users (user_id, username, email, password, "isAdmin", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, now(), now()) returning *', [admin_name, admin_email, hashpass, true], (err, data) => {
            if (err) console.log("my seed ---->  " + err.message);

            console.log(data.rows);

        });

    }




    //    default category add.
    const check = await pool.query(`select * from categories where category_name=$1`, ["all"]);

    if (check.rows.length == 0) {
        pool.query('INSERT INTO categories (category_id, category_name, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, now(), now()) returning *', ["all"], (err, data) => {
            if (err) console.log("my seed ---->  " + err.message);
            console.log(data.rows);
        });
    };


};