import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./auth.validation.js";
import * as authController from "./controller/auth.js"
import { auth } from "../../middleware/auth.js";




const authRouter = Router()

authRouter.get("/test", authController.test)
//signup
authRouter.post("/sign_up", validation(validators.signUpSchema), authController.signUp)

//signIn
authRouter.post("/sign_in", validation(validators.logInSchema), authController.signIn)

//logOut
authRouter.post("/log_out", auth, authController.logOut)

export default authRouter