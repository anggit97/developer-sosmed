const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const User = require('../../models/User')
const Post = require('../../models/Post')

//@route    POST api/post
//@desc     Create post
//@access   Private
router.post(
    '/',
    [
        auth,
        [
            check('text', 'Text is required')
                .not()
                .notEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const user = await User.findById(req.user.id).select('-password')

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })

            const post = await newPost.save()

            res.json(post)

        } catch (error) {
            console.error(error.message)
            res.status(500).json({ msg: 'server error' })
        }
    }
)

//@route    GET api/post
//@desc     Get user posts
//@access   Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ msg: 'server error' })
    }
})

//@route    GET api/post/:id
//@desc     Get user by id
//@access   Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        res.json(post)
    } catch (error) {
        console.log(error.message)

        if (error.message.includes("ObjectId failed")) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        res.status(500).json({ msg: 'server error' })
    }
})

//@route    DELETE api/post/:id
//@desc     Delete Post By id
//@access   Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User is Unauthorized' })
        }

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        await post.remove()

        res.json({ msg: 'Post is deleted' })
    } catch (error) {
        console.log(error.message)

        if (error.message.includes("ObjectId failed")) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        res.status(500).json({ msg: 'server error' })
    }
})


//@route    POST api/posts/like/:id
//@desc     Like post by post id
//@access   Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        //check if this user already like the post
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' })
        }

        post.likes.unshift({ user: req.user.id })

        await post.save()

        res.json(post.likes)
    } catch (error) {
        console.log(error.message)

        if (error.message.includes("ObjectId failed")) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        res.status(500).json({ msg: 'server error' })
    }
})

//@route    POST api/posts/unlike/:id
//@desc     Unlike post by post id
//@access   Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        //check if this user already like the post
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post have not like yet' })
        }

        //get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

        post.likes.splice(removeIndex, 1)

        await post.save()

        res.json(post.likes)
    } catch (error) {
        console.log(error.message)

        if (error.message.includes("ObjectId failed")) {
            return res.status(404).json({ msg: 'Post not found' })
        }

        res.status(500).json({ msg: 'server error' })
    }
})


//@route    POST api/post/comment/:id
//@desc     Comment a post
//@access   Private
router.post(
    '/comments/:id',
    [
        auth,
        [
            check('text', 'Text is required')
                .not()
                .notEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const user = await User.findById(req.user.id).select('-password')
            const post = await Post.findById(req.params.id)

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }

            post.comments.unshift(newComment)

            await post.save()

            res.json(post)

        } catch (error) {
            console.error(error.message)
            res.status(500).json({ msg: 'server error' })
        }
    }
)

//@route    DELETE api/post/comment/:id
//@desc     Delete comment post by id comment
//@access   Private
router.delete(
    '/comments/:id/:comment_id',
    auth
    ,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)

            const comment = post.comments.find(comment => comment.id === req.params.comment_id)

            if (!comment) {
                return res.status(404).json({ msg: 'Comment not found' })
            }

            if (comment.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Action do not authorized' })
            }

            const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)

            post.comments.splice(removeIndex, 1)

            await post.save()

            res.json(post.comments)
        } catch (error) {
            console.error(error.message)
            res.status(500).json({ msg: 'server error' })
        }
    }
)

module.exports = router
