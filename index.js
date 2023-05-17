import dotenv from "dotenv";
dotenv.config({ path: "./Config/.env" })
import express from "express";


import initApp from "./src/index.router.js"
const app = express()
const port = process.env.PORT || 5000
initApp(app, express)




app.listen(port, () => {
    console.log("server is running ...... ")
})