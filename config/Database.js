import {Sequelize} from "sequelize";


const db = new Sequelize('webcuti_db', 'root', '', {
    host: "localhost",
    dialect: "mysql",

});

export default db;