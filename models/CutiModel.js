import { Sequelize } from "sequelize"
import db from "../config/Database.js"
import Users from "./UserModel.js"

const {DataTypes} = Sequelize

//pembuatan Tabel Cuti
const Cuti = db.define('cuti', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tanggal_awal: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
      
        }
    },  
    tanggal_akhir: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
          
        }
    },
    total_hari: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    alasan_cuti: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
          
        }
    },
    approval: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
          
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
          
        }
    },
}, {
    freezeTableName: true
})

Users.hasMany(Cuti)
Cuti.belongsTo(Users, {foreignKey: 'userId'})


export default Cuti