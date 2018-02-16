'use strict';
import Comment from '../models/comment'

export const getCommentsByClientId = async(clientid) => {
    try {
        let result = await Comment.find({clientid: clientid})
        .catch(err => {
            throw new Error('Error while find comments by userId from db')
        });
        return result;
    } catch(err) {
        console.log(err);
    }
}

export const createComment = async(comment) => {
    try {
        await comment.save().catch(err => {
            throw new Error('Error while save new comment into db');
        });
        return true;
        //TODO return??
    } catch(err) {
        console.log(err);
    }
}



