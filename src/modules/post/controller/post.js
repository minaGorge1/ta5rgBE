import postModel from "../../../../DB/model/Post.model.js"
import cloudinary from "../../../utils/cloudinary.js"
import { asyncHandler } from "../../../utils/errorHandling.js"

//get all posts
export const posts = asyncHandler(async (req, res, next) => {
    const postList =await postModel.find({}).populate([
        {
            path: "comments"
        } ,
        {
            path: 'like',
            select: "userName profilePic"
        },
        {
            path: 'unlike',
            select: "userName profilePic"
        } 
    ])
    return res.status(201).json({ message: "Done", postList })
})

//addPosts
export const addPosts = asyncHandler(async (req, res, next) => {
    const { post } = req.body
    const images = []
    for (const file of req.files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `user/${req.user._id}/posts` })
        images.push({ secure_url, public_id })
    }
    const postSaved = await postModel.create({ post: post, createdBy: req.user._id, postImage: images })
    return res.status(201).json({ message: "Done", postSaved })
})

//update post
export const updatePost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params
    const { post } = req.body
    const images = []
    const oldPost = await postModel.findOne({ _id: postId, createdBy: req.user._id })
    if (!oldPost || oldPost.isDeleted) {
        return next(new Error(`not Found post`, { cause: 404 }))
    }
    if (!post || oldPost.post == post) {
        return next(new Error(`In-valid post`, { cause: 409 }))
    }
    oldPost.post = post
    await oldPost.save()
    return res.json({ message: "Done", oldPost });
})

//update add post image
export const addPostImages = asyncHandler(async (req, res, next) => {
    const { postId } = req.params
    const oldPost = await postModel.findOne({ _id: postId, createdBy: req.user._id })
    if (!oldPost || oldPost.isDeleted) {
        return next(new Error(`not Found post`, { cause: 404 }))
    }
    if (req.files) {
        for (const file of req.files) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `user/${req.user._id}/posts` })
            oldPost.postImage.push({ secure_url, public_id })
        }
    }
    await oldPost.save()
    return res.json({ message: "Done", oldPost });
})

//delete post image
export const deletePostImage = asyncHandler(async (req, res, next) => {
    const { postId, imageName } = req.params
    const public_id = `user/${req.user._id}/posts/${imageName}`
    const oldPost = await postModel.findOne({ _id: postId, createdBy: req.user._id })
    if (!oldPost || oldPost.isDeleted) {
        return next(new Error(`not Found post`, { cause: 404 }))
    }
    if (!oldPost.postImage.length) {
        return next(new Error(`not Found image`, { cause: 404 }))
    }
    await cloudinary.uploader.destroy(public_id)
    oldPost.postImage = oldPost.postImage.filter((image) => { image.public_id == public_id })
    await oldPost.save()
    return res.json({ message: "Done", oldPost });
})

//delete post
export const deletePost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params
    const post = await postModel.findByIdAndDelete({ _id: postId })
    //softDelete
    //const post = await postModel.findByIdAndUpdate({ _id:postId }, { isDeleted: true })
    if (!post || post.isDeleted) {
        return next(new Error(`not Found post`, { cause: 404 }))
    }
    return res.json({ message: "Done", post });
})

//softDelete post
export const softDeletePost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params
    const post = await postModel.findById({ _id: postId })
    if (!post || post.isDeleted) {
        return next(new Error(`not Found post`, { cause: 404 }))
    }
    post.isDeleted= true
    return res.json({ message: "Done", post });
})



//like
export const likePost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
    const { _id } = req.user;
    //use push
    /* const post = await postModel.findOneAndUpdate(
        { _id: id, like: { $ne: _id } }, //l3dm al tkrar al like
        { $push: { like: _id } },
        { new: true }
    ) */

    //add To Set
    const post = await postModel.findByIdAndUpdate(
        postId,
        {
            $addToSet: { like: _id },
            $pull: { unlike: _id }
        },//lw 3aml msh hidifk tany
        { new: true }
    )
    post.totalVote = post.like.length - post.unlike.length
    await post.save()
    return res.status(201).json({ message: "Done", post })
})

//unlike
export const unlikePost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
    const { _id } = req.user;
    //add To Set
    const post = await postModel.findByIdAndUpdate(
        postId,
        {
            $addToSet: { unlike: _id },
            $pull: { like: _id }
        },//lw 3aml msh hidifk tany
        { new: true }
    )
    post.totalVote = post.like.length - post.unlike.length
    await post.save()
    return res.status(201).json({ message: "Done", post })
})


