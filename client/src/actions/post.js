import axios from 'axios'
import { setAlert } from './alert'
import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES
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
