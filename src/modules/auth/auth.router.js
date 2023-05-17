import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from "./auth.validation.js";
import * as authController from "./controller/auth.js"
import { auth } from "../../middleware/auth.js";




const authRouter = Router()

authRouter.get("/test", authController.test)
//signup
authRouter.post("/sign_up", validation(validators.signUpSchema), authController.signUp)

//confirmEmail
/* authRouter.get("/confirmEmail/:token", authController.confirmEmail) */

//requestNewEmail
/* authRouter.get("/requestNewEmail/:rFToken", authController.requestNewEmail) */

//signIn
authRouter.post("/sign_in", validation(validators.logInSchema), authController.signIn)

//forGotPass
authRouter.get("/forGotPass/",validation(validators.forGotPassword), authController.forGotPass)

//GotNewPass
authRouter.post("/GotNewPass/:token", validation(validators.GotNewPass), authController.GotNewPass)

//logOut
authRouter.post("/log_out", auth, authController.logOut)

export default authRouter