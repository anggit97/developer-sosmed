const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')

//@route    GET api/auth
//@desc     Test Route
//@access   Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ msg: 'fail' })
    }
})

//@route    POST api/users
//@desc     Register user
//@access   Public
router.post('/', [
    check('email', 'Email format is invalid').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
        let user = await User.findOne({ email: email })

        if (!user) {
            return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] })
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err
                return res.status(200).send({ msg: "success login", token: token })
            }
        )

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ errors: [{ msg: 'server error' }] })
    }
})

module.exports = router
