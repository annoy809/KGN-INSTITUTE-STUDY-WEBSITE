import { Sequelize } from "sequelize";

const sequelize = new Sequelize("kgn_center", "root", "your_password", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

export default sequelize;
