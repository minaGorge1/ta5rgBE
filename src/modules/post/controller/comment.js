import commentModel from "../../../../DB/model/Comment.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudinary.js"
import postModel from "../../../../DB/model/Post.model.js";


//comments
export const comments = asyncHandler(async (req, res, next) => {
    const { postId } = req.params
    const commentList = await commentModel.find({ postId: postId }).populate([
        {
            path: 'reply',
            select: "text userId"
        }
    ])
    return res.status(201).json({ message: "Done", commentList })
})



//create Comment
export const createComment = asyncHandler(async (req, res, next) => {

    const post = await postModel.findById(req.params.postId)
    if (!post) {
        return next(new Error("In-valid post id", { cause: 404 }))
    }
    req.body.postId = post._id;
    req.body.userId = req.user._id
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "Comment" })
        req.body.image = { secure_url, public_id }
    }
    const comment = await commentModel.create(req.body)
    return res.status(201).json({ message: "Dona", comment })
})

//reply Comment
export const replyComment = asyncHandler(async (req, res, next) => {
    const { commentId, postId } = req.params
    const comment = await commentModel.findOne({ _id: commentId, postId: postId })
    if (!comment) {
        return next(new Error("In-valid post or comment id", { cause: 404 }))
    }

    req.body.postId = postId;
    req.body.userId = req.user._id;
    req.body.commentType = "reply"
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "Comment" })
        req.body.image = { secure_url, public_id }
    }
    const reply = await commentModel.create(req.body)
    comment.reply.push(reply._id)
    await comment.save()
    return res.status(201).json({ message: "Dona", comment })
})

//update Comment
export const updateComment = asyncHandler(async (req, res, next) => {
    const { commentId } = req.params
    const { text } = req.body

    const Comment = await commentModel.findById({ _id: commentId, createdBy: req.user._id })
    if (!Comment || Comment.softDelete) {
        return next(new Error(`not Found Comment`, { cause: 404 }))
    }
    if (!text || Comment.text == text) {
        return next(new Error(`In-valid Comment`, { cause: 409 }))
    }
    Comment.text = text
    await Comment.save()
    return res.json({ message: "Done", Comment });
})


//delete Comment
export const deleteComment = asyncHandler(async (req, res, next) => {
    const { commentId } = req.params
    const comment = await commentModel.findByIdAndDelete({ _id: commentId })
    if (!comment || comment.softDelete) {
        return next(new Error(`not Found comment`, { cause: 404 }))
    }
    return res.json({ message: "Done" });
})

//softDelete post
export const softDeleteComment = asyncHandler(async (req, res, next) => {
    const { commentId } = req.params
    const comment = await commentModel.findById({ _id: commentId })
    if (!comment || comment.softDelete) {
        return next(new Error(`not Found comment`, { cause: 404 }))
    }
    comment.softDelete = true
    comment.save()
    return res.json({ message: "Done", comment });
})



//like
export const likeComment = asyncHandler(async (req, res, next) => {
    const { commentId } = req.params;
    const { _id } = req.user;
    const comment = await commentModel.findByIdAndUpdate(
        commentId,
        {
            $addToSet: { like: _id },
            $pull: { unlike: _id }
        },
        { new: true }
    )
    comment.totalVote = comment.like.length - comment.unlike.length
    await comment.save()
    return res.status(201).json({ message: "Done", comment })
})

//unlike
export const unlikeComment = asyncHandler(async (req, res, next) => {
    const { commentId } = req.params;
    const { _id } = req.user;
    //add To Set
    const comment = await commentModel.findByIdAndUpdate(
        commentId,
        {
            $addToSet: { unlike: _id },
            $pull: { like: _id }
        },
        { new: true }
    )
    comment.totalVote = comment.like.length - comment.unlike.length
    await comment.save()
    return res.status(201).json({ message: "Done", comment })
})


