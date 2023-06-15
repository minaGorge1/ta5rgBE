import foodModel from "../../../../DB/model/food.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"

//get food
export const food = asyncHandler(async (req, res, next) => {
    const { nameDisease } = req.params
    const food = await foodModel.find({ nameDisease })
    return res.status(201).json({ message: "Done", food })
})

//addFood
export const addFood = asyncHandler(async (req, res, next) => {
    const { nameDisease, food } = req.body
    const foodSaved = await foodModel.create({ nameDisease, food })
    return res.status(201).json({ message: "Done", foodSaved })
})

