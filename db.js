const mysql=require("mysql2");

const db= mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"root",
    database:"hospital_db"
});

db.connect(err =>{
    if(err)
    {
    console.error("DB connection failed:",err);
    return;}
    console.log("MysQl connected")
});

module.exports=db;