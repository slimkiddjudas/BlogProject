import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false,
    dialect: "postgres",
  }
);

async function connectDB() {
  try {
    await db.authenticate();
    console.log("PostgreSQL veritabanına başarıyla bağlanıldı.");
  } catch (error) {
    console.error("Veritabanına bağlanırken hata oluştu:", error);
  }
}

connectDB();
export default db;
