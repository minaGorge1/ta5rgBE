import mongoose, { Schema, model, Types } from "mongoose";

const postSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        Request: true
    },
    post: {
        type: String,
        Request: true
    },
    postImage: [],
    like: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    unlike: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    totalVote:{
        type: Number,
        default: 0
    }
}, {
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps: true
})


postSchema.virtual("comments",{
    localField:"_id",
    foreignField:"postId",
    ref:"Comment"
})

const postModel = mongoose.models.Post || model("Post", postSchema)
export default postModel

