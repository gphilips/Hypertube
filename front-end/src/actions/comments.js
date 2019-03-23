import axios from "axios";
import createNotification from "../utils/notificationForm";
import { STORE_COMMENTS, CLEAR_COMMENTS, COMMENT_ADDED, COMMENT_REMOVED } from "../constants/comments";

export const commentAdded = (comment) => ({
    type: COMMENT_ADDED,
    payload: comment,
});

export const commentRemoved = (commentId) => ({
    type: COMMENT_REMOVED,
    payload: commentId,
});

export const clearComments = () => ({
    type: CLEAR_COMMENTS,
});

export const storeAllComments = (comments) => ({
    type: STORE_COMMENTS,
    payload: comments,
});

export const addNewComment = ( userId, movieId, commentContent ) => dispatch => {
    return axios({
        method: 'POST',
        url:  `/api/comments/${movieId}`,
        data: {
            userId,
            commentContent,
            },
    })
    .then(res => {
        if (res.status === 200) {
            const { success, errors, returnComment } = res.data;
            if (!success) {
                errors.forEach(err => createNotification("error", err.msg));
                createNotification("error", "An error occurred while saving your comment!");
            }
            createNotification("success", "Comment successfully added!");
            dispatch(commentAdded(returnComment));
        } else {
            createNotification(
                "warning",
                `There is an internal error (${res.status})`
            );               
        }
        return;
    })
    .catch(err => err);
}

export const getAllComments = (movieId) => dispatch => {
    return axios({
        method: 'GET',
        url:  `/api/comments/${movieId}`,
    })
    .then(res => {
        if (res.status === 200) {
            const { success, errors, comments } = res.data;
            if (!success) {
                errors.forEach(err => createNotification("error", err.msg));
            } else {
                dispatch(storeAllComments(comments));
            }
        } else {
            createNotification(
                "warning",
                `There is an internal error (${res.status})`
            );              
        }
        return;
    })
    .catch(err => err);
}

export const removeComment = (commentId) => dispatch => {
    return axios({
        method: 'DELETE',
        url:  `/api/comments/${commentId}`,
    })
    .then(res => {
        if (res.status === 200) {
            const { success, errors } = res.data;
            if (!success) {
                errors.forEach(err => createNotification("error", err.msg));
                createNotification("error", "An error occurred while deleting your comment!");
            }
            createNotification("success", "Comment successfully deleted!");
            dispatch(commentRemoved(commentId));
        } else {
            createNotification(
                "warning",
                `There is an internal error (${res.status})`
            );              
        }
        return;
    })
    .catch(err => err);
}