const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const auth = require('../middleware/auth')

//add a post
router.post("/", auth, (req, res)=>{
	let{title, body} = req.body
	const post = new Post()
	post.title = title
	post.body = body
	post.author = req.user.id
	post.save()
	return res.json({msg: "Post added successfully", post})
})

//view all posts
router.get("/", async(req,res)=>{
	//Post.find({}, (err,posts)=>{
		//return res.json(posts)
	//})

	//ASYNC AWAIT
	const posts = await Post.find()
	
})

//Get all the post of the logged in user
//localhost:3000/posts/myposts
router.get("/myposts", auth, async (req, res)=>{
	//Post.find({author:req.user.id}, (err,posts)=>{
		//if(!err) return res.json(posts)
		//return res.json(err)
	//})
	try{
		const posts = await Post.find({author:req.user.id})
		return res.json(posts)
	}catch(err){
		return res.json(err)
	}
})
//view post by id
router.get("/:id", auth, async(req,res)=>{
	//Post.fingById(req.params.id,(err,post)=>{
		//if(!err)returnres.json(post)
	//})
	const post = await Post.findBy(req.params.id)
	return res.json(post)
})
//update a post
router.put("/:id", auth, async(req,res)=>{
	
try{
	const post = await Post.findById(req.params.id)

	if(!post)return res.json({msg: "Post doesn't exist"})

	if(post author.toString() !== req.user.id) return res.json({msg: "Unauthorized"})

	post.title = req.body.title
	post.body = req.body.body

	await Post.updateOne({_id: req.params.id}, post)
	await post.save()
	return res.json({
		msg: "Post updated successfully",
		post
	})
}catch(err){
	return res.json(err)
}
})



//delete a post
router.delete("/:id", auth, (req,res)=>{
	//you need to delete the post with id matching with the url and you can delete the post only if you are the author of the post

	try{
		//firt find that post
		const post = await Post.findById(req.params.id)

		//check if there is indeed a post
		if(!post)return res.json({msg: "Post not found"})

		//check if the user who is logged owns that post
		if(post.author.toString !== req.user.id){
			return res.status(401).json({msg: "Unauthorized"})
		}

		await post.remove()
		return res.json({msg: "Post is removed"})
	}catch(err){
		return res.json(err)
	}
})

module.exports = router