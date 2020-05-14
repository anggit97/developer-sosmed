import axios from 'axios'
import { setAlert } from './alert'
import {
    GET_POSTS,
    GET_POST,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST
} from './types'

//get posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts')

        dispatch({
            payload: res.data,
            type: GET_POSTS
        })

    } catch (error) {
        dispatch({
            payload: { msg: error.response.statusText, status: error.response.status },
            type: POST_ERROR
        })
    }
}

//Add like 
export const addLike = id => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${id}`)

        dispatch({
            payload: { id, likes: res.data },
            type: UPDATE_LIKES
        })
    } catch (error) {
        dispatch({
            payload: { msg: error.response.statusText, status: error.response.status },
            type: POST_ERROR
        })
    }
}

//Remove like
export const removeLike = id => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${id}`)

        dispatch({
            payload: { id, likes: res.data },
            type: UPDATE_LIKES
        })
    } catch (error) {
        dispatch({
            payload: { msg: error.response.statusText, status: error.response.status },
            type: POST_ERROR
        })
    }
}

//Delete post
export const deletePost = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/${id}`)

        dispatch({
            type: DELETE_POST,
            payload: id
        })

        dispatch(setAlert("Post Removed", "success"))
    } catch (error) {
        dispatch({
            payload: { msg: error.response.statusText, status: error.response.status },
            type: POST_ERROR
        })
    }
}

//Add post
export const addPost = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {
        const res = await axios.post(`/api/posts`, formData, config)

        dispatch({
            type: ADD_POST,
            payload: res.data
        })

        dispatch(setAlert("Post Added", "success"))
    } catch (error) {
        dispatch({
            payload: { msg: error.response.statusText, status: error.response.status },
            type: POST_ERROR
        })
    }
}

export const getPost = id => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`)

        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            payload: { msg: error.response.statusText, status: error.response.status },
            type: POST_ERROR
        })
    }
}
