import connectDB from "../DB/connection.js";
import cors from "cors"
import authRouter from "./modules/auth/auth.router.js";
import { globalErrorHandling } from "./utils/errorHandling.js";
import foodRouter from "./modules/food/food.route.js";
import userRouter from "./modules/user/user.route.js";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url)) // url a7na fiin 7alin


const initApp = (app, express) => {
    app.use(cors())
    app.use(express.json({}))

    app.use("/uploads", express.static(path.join(__dirname, "./uploads")))

    app.get("/", (req, res, next) => {
        res.json("home")
    })
    app.use("/auth", authRouter)
    app.use("/user", userRouter)
    app.use("/food", foodRouter)

    app.use("*", (req, res) => res.json(`404 Not found`))

    app.use(globalErrorHandling)
    connectDB()
}

export default initApp