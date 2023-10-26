import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import { Sequelize } from "sequelize";
//import bodyParser from 'body-parser'
import SequelizeStore from "connect-session-sequelize";
import cutiRoute from "./routes/CutiRoute.js";
import userRoute from "./routes/UserRoute.js";
import authRoute from "./routes/AuthRoute.js";

dotenv.config()


const app = express()

const sessionStore = SequelizeStore(session.Store)

const store = new sessionStore({
    db: db
})

//await db.sync({force: true})
  
app.use(cors({
    credentials: true,
    origin:'http://localhost:3000'
}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}))




app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(cutiRoute, userRoute, authRoute)

//store.sync()


const port = process.env.APP_PORT


app.listen(process.env.APP_PORT, () => {
    console.log('Server Running at http://localhost:',port)
})




