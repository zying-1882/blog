const express = require("express")
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt.js')

//ADD USER
router.post("/",(req, res)=>{
	if(req.body.username.length < 8) res.status(400).json({message: "Username must be greater than 8 characters"})

	if(req.body.password.length <8)res.status(400).json({message:"Password must be greater than 8 characters"})
	User.findOne({"username": req.body.username}, function(err, user){
		if(user){
			res.status(400).json({message:"User already exist"})
		}else{
		let user = new User();
		user.name = req.body.name
		user.username = req.body.username

		let salt = bcrypt.genSaltSync(10)
		let hash = bcrypt.hashSync(req.body.password, salt)
		user.password = hash

		user.save()
		res.json({
		message: "Registered successfully",
		user

		})
	}

	})
})