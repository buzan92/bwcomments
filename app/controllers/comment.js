'use strict';
import Comment from '../models/comment'

export const getCommentsByClientId = async(clientid) => {
    try {
        let result = await Comment.find({clientid: clientid})
        .sort({ createdate: -1 })
        .catch(err => {
            throw new Error('Error while find comments by clientId from db')
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

export const replyComment = async(id, createdate, content) => {
    try {
        await Comment.findByIdAndUpdate(id, {
            $push: {"reply": {
                createdate: createdate,
                content: content
            }}
        })
        .catch(err => {
            throw new Error('Error while save new comment into db');
        });
        return true;
        //TODO return??
    } catch(err) {
        console.log(err);
    }
}



