import { Sequelize } from "sequelize";
import Keys from "./config/config";

const db = new Sequelize(Keys.DB_NAME, Keys.DB_USERNAME, Keys.DB_PASSWORD, {
  host: Keys.HOST,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
export default db;
