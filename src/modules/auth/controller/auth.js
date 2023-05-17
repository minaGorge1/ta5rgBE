import userModel from "../../../../DB/model/User.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import { compare, hash } from "../../../utils/hashAndCompare.js"



export const test = asyncHandler((req, res, next) => {
    return res.json({ message: "hi" })
})

/* (userName,phone,email,password,cPassword,status) */

//signUp
export const signUp = asyncHandler(async (req, res, next) => {

    const { userName, email, phone, password } = req.body
    if (await userModel.findOne({ email })) {
        return next(new Error("Email Exist", { cause: 409 }))
    }


    

    //hashPassword
    const hashPassword = hash({ plaintext: password, saltRound: parseInt(process.env.SALTROUND) })
    //save
    const user = await userModel.create({ userName, email, phone, password: hashPassword })
    return res.status(201).json({ message: "Done", user })
})



//signIn
export const signIn = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error(" Email not exist ", { cause: 404 }))
    }
    if (!user.confirmEmail) {
        return next(new Error("please confirm your email", { cause: 400 }))
    }
    const match = compare({ plaintext: password, hashValue: user.password })
    if (!match) {
        return next(new Error("In-Valid password", { cause: 400 }))
    }
const _id = user.id
    const status = await userModel.findOneAndUpdate(email, { status: "online" }, { new: true })
    /* const token = createToken({ payload: { id: user._id, userName: user.userName, email: user.email }, expiresIn: 60 * 60 * 24 })
     */return res.status(200).json({ message: "Done", _id })
})


//logOut
export const logOut = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, { status: "offline" })
    console.log(res.redirect("/sign_in"));
})
