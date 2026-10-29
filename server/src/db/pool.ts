/**
 * @file-id ER-FILE-SERVER-DB-POOL-0001
 * @module-id ER-MOD-SERVER-DB-0001
 * @doc ../../../docs/source/server-pool.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Purpose: central MySQL pool with environment-based credentials.
 */
import mysql from "mysql2/promise";
export const pool=mysql.createPool({
 host:process.env.MYSQL_HOST??"127.0.0.1",
 port:Number(process.env.MYSQL_PORT??3306),
 user:process.env.MYSQL_USER??"earthbound",
 password:process.env.MYSQL_PASSWORD??"",
 database:process.env.MYSQL_DATABASE??"earthbound_realms",
 waitForConnections:true,connectionLimit:10,queueLimit:0,enableKeepAlive:true
});
