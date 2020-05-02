const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')

//@route    POST api/users
//@desc     Register user
//@access   Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email format is invalid').isEmail(),
    check('password', 'Password min 6 character').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {


        let user = await User.findOne({ email: email })

        if (user) {
            res.status(400).json({ errors: [{ msg: 'User is already exists' }] })
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            password,
            password
        })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        await user.save()

        //return jsonwebtoken
        res.send("User registered")
    } catch (error) {
        console.log(error.message)
        res.status(500).send(errors.message)
    }
})

module.exports = router
