import joi from "joi"
import { generalFields } from "../../middleware/validation.js"



export const addPost = joi.object({
    post: joi.string(),
    file: joi.array().items(generalFields.file)
})

export const updatePost = joi.object({
    postId: generalFields.id,
    post: joi.string().required(),
}).required()

export const addPostImages = joi.object({
    postId: generalFields.id,
    file: joi.array().items(generalFields.file.required())
}).required()

export const deletePostImage = joi.object({
    postId: generalFields.id,
    imageName: joi.string().required()
})

export const deletePost = joi.object({
    postId: generalFields.id,
})

export const likeOrDislike = joi.object({
    postId: generalFields.id
}).required()


//comment
export const createComment = joi.object({
    text: joi.string().required(),
    postId: generalFields.id,
    file: generalFields.file
}).required()


//replyComment
export const replyComment = joi.object({
    text: joi.string().required(),
    postId: generalFields.id,
    commentId: generalFields.id,
    file: generalFields.file
})

//updateComment
export const updateComment = joi.object({
    text: joi.string().required(),
    commentId: generalFields.id,
    file: generalFields.file
})

//deleteComment
export const deleteComment = joi.object({
    commentId: generalFields.id,
})

export const likeOrDislikeComment = joi.object({
    commentId: generalFields.id
}).required()
