const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')

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

module.exports = router
