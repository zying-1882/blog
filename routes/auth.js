const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

//(POST)localhost:3000/auth
router.post("/", (req,res)=>{
	//Object Destructuring
	const{ username, password} = req.body

	..Check if the user exist
	User.findOne({username}, (err, user)=>{
		if(!user){
		 return res.status(400).json({msg:"User Doesn't exist"})
		
		}
		let isMatch = brcypt.compareSync(password, user.password)

		if(!isMatch){
			return res.status(400).json({msg: "Invalid Credentials"})
		}

		let payload = {
			user: {
				id: user.id,
				username:user.username,
				name: user.name
			}
		}


		//Syntax jwt.sign(payload, secretKey, options, callback)
		jwt.sign(user,
			"mysecretket",
			{expiresIn: "1h"},
			(err, token)=>{
				if(err) return res.status(400).json({err})
					return res.json({token})
			}

			)

	})
})

module.exports = router