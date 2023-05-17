import mongoose, { Schema, model, Types } from "mongoose";

const commentSchema = new Schema({
    text: {
        type: String,
        Request: true
    },
    image: Object,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        Request: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        Request: true
    },
    reply: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    like: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    unlike: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    softDelete: {
        type: Boolean,
        default: false
    },
    commentType: {
        type: String,
        default: "comment",
        enum: ["comment", "reply"]
    }
}, {
    timestamps: true
})
//mongoose.model.commentModel ||
const commentModel = mongoose.models.Comment ||  model("Comment", commentSchema)
export default commentModel

