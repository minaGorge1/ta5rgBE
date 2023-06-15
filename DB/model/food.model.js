import mongoose, { Schema, model, Types } from "mongoose";

const foodSchema = new Schema({
    nameDisease: String,
    food: [{
        name: String,
        status: {
            type: String,
            default: "unhelthy",
            enum: ["helthy", "unhelthy"]
        }
    }]
}, {
    timestamps: true
})
//mongoose.model.foodModel ||
const foodModel = mongoose.models.food || model("food", foodSchema)
export default foodModel

