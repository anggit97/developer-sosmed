const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')
const Profile = require('../../models/Profile')

//@route    GET api/profile/me
//@desc     Get current user profile
//@access   Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }

        res.json({ profile })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ msg: 'server error' })
    }
})


//@route    GET api/profile
//@desc     Get all profiles
//@access   Public
router.get('/', async (req, res) => {
    try {
        const profile = await Profile.find().populate('user', ['name', 'avatar'])

        res.json(profile)
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ msg: 'server error' })
    }
})

//@route    GET api/profile/:user_id
//@desc     Get user profile by user id
//@access   Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({ msg: "Profile not found" })
        }

        res.json(profile)
    } catch (error) {
        console.error(error.kind)

        if (error.message.includes("ObjectId")) {
            return res.status(400).json({ msg: "Profile not found" })
        }

        return res.status(500).json({ msg: 'server error' })
    }
})


//@route    POST api/profile
//@desc     Create or Update user profile
//@access   Private
router.post('/', [
    auth,
    [
        check('status', 'status is required')
            .not()
            .isEmpty(),
        check('skills', 'skills is required')
            .not()
            .isEmpty()
    ]
], async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body

    //build profile object
    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim())
    }

    //Build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (linkedin) profileFields.social.linkedin = linkedin
    if (facebook) profileFields.social.facebook = facebook
    if (twitter) profileFields.social.twitter = twitter
    if (instagram) profileFields.social.instagram = instagram

    try {
        //find profile in collection by user id
        let profile = await Profile.findOne({ user: req.user.id })

        //Update
        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            )
        }

        //Create
        profile = new Profile(profileFields)

        await profile.save()

        return res.status(200).json(profile)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: "server error" })
    }
})


//@route    DELETE api/profile/:user_id
//@desc     Delete Profile, User, Post
//@access   Public
router.delete('/', auth, async (req, res) => {
    try {
        //@todo delete user post

        //delete profile
        await Profile.findOneAndRemove({ user: req.user.id })

        //remove user
        await Profile.findOneAndRemove({ _id: req.user.id })

        res.json({ msg: "User deleted" })
    } catch (error) {
        console.error(error.message)

        if (error.message.includes("ObjectId")) {
            return res.status(400).json({ msg: "Profile not found" })
        }

        return res.status(500).json({ msg: 'server error' })
    }
})

//@route    PUT api/profile/experience
//@desc     Add profile experience
//@access   Private
router.put('/experience', [
    auth,
    [
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company is required').not().isEmpty(),
        check('from', 'From is required').not().isEmpty()
    ]
], async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id })

        profile.experience.unshift(newExp)

        await profile.save()

        res.status(200).json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ msg: 'server error' })
    }
})

//@route    DELETE api/profile/experience/:exp_id
//@desc     Delete experience
//@access   Private
router.delete('/experience/:expr_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })

        //Get Remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.expr_id)

        //Remove experience
        profile.experience.splice(removeIndex, 1)

        await profile.save()

        res.json(profile)
    } catch (error) {
        console.error(err.message)
        res.status(500).json({ msg: 'server error' })
    }
})

module.exports = router
