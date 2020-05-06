const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
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
            return res.status(400).json({ errors: [{ msg: 'User is already exists' }] })
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
            avatar
        })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        await user.save()

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
                return res.status(200).send({ msg: "success register", token: token })
            }
        )

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ errors: [{ msg: 'server error' }] })
    }
})

module.exports = router
