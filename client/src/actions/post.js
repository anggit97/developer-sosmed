import axios from 'axios'
import { setAlert } from './alert'
import {
    GET_POSTS,
    POST_ERROR
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
