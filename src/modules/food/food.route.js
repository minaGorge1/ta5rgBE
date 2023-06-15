import { Router } from "express"
import * as foodController from "./controller/food.js"



const foodRouter = Router()

//food
foodRouter.get("/:nameDisease",
    foodController.food)

//addFood
foodRouter.post("/add-food",foodController.addFood)

export default foodRouter