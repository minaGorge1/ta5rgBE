import { Router } from "express"
import { auth } from "../../middleware/auth.js"
import { validation } from "../../middleware/validation.js"
import { fileUpload, fileValidation } from "../../utils/cloudMulter.js";
import * as postController from "./controller/post.js"
import * as commentController from "./controller/comment.js"
import * as validators from "./post.validation.js"


const postRouter = Router()

//posts
postRouter.get("/",
    postController.posts)

//addPosts
postRouter.post("/add-post",
    auth,
    validation(validators.addPost),
    fileUpload(fileValidation.image).array("image"),
    postController.addPosts)


//updatePost
postRouter.put("/:postId/update",
    auth,
    validation(validators.updatePost),
    postController.updatePost)

//update add post image
postRouter.put("/:postId/update/add-image",
    auth,
    validation(validators.addPostImages),
    fileUpload(fileValidation.image).array("image"),
    postController.addPostImages)

//delete post image
postRouter.delete("/:postId/delete/:imageName",
    auth,
    validation(validators.deletePostImage),
    postController.deletePostImage)


//deletePost
postRouter.delete("/:postId/delete",
    auth,
    validation(validators.deletePost),
    postController.deletePost)

//softDeletePost
postRouter.patch("/:postId/delete",
    auth,
    validation(validators.deletePost),
    postController.softDeletePost)

//like 
postRouter.patch("/:postId/like",
    auth,
    validation(validators.likeOrDislike),
    postController.likePost)

//unlike 
postRouter.patch("/:postId/unlike",
    auth,
    validation(validators.likeOrDislike),
    postController.unlikePost)


//=====================================================comment=============================================================

//comments
postRouter.get("/:postId/comments",
    commentController.comments)



//comment
postRouter.post("/:postId/comment",
    auth,
    validation(validators.createComment),
    fileUpload(fileValidation.image).single("image"),
    commentController.createComment)

//replyComment
postRouter.post("/:postId/comment/:commentId/reply",
    auth,
    validation(validators.replyComment),
    fileUpload(fileValidation.image).single("image"),
    commentController.replyComment)

//updateComment
postRouter.put("/comment/:commentId/update",
    auth,
    validation(validators.updateComment),
    commentController.updateComment)

//deletePost
postRouter.delete("/comment/:commentId/delete",
    auth,
    validation(validators.deleteComment),
    commentController.deleteComment)

//softDeletePost
postRouter.patch("/comment/:commentId/delete",
    auth,
    validation(validators.deleteComment),
    commentController.softDeleteComment)

//like 
postRouter.patch("/comment/:commentId/like",
    auth,
    validation(validators.likeOrDislikeComment),
    commentController.likeComment)

//unlike 
postRouter.patch("/comment/:commentId/unlike",
    auth,
    validation(validators.likeOrDislikeComment),
    commentController.unlikeComment)


export default postRouter