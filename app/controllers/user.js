'use strict';
import User from '../models/user'

export const getUser = async(chatid) => {
    try {
        const result = await User.findOne({chatid: chatid})
        .catch(err => {
            throw new Error('Error while find user from DB');
        })
        return result;
    } catch(err) {
        console.log(err);
    }
}

export const getUserCount = async() => {
    try {
        let result = await User.count()
        .catch(err => {
            throw new Error('Error while count users from DB');
        })
        return result;
    } catch(err) {
        console.log(err);
    }
}

export const createUser = async(user) => {
    try {
        const newuser = await user.save().catch(err => {
            throw new Error('Error while save new user into db');
        });
        return newuser;
    } catch(err) {
        console.log(err);
    }
}

export const updateUserState = async(chatid, state, clientid) => {
    try {
        await User.findOneAndUpdate(
            {chatid: chatid}, 
            { $set: { 
                    state: state,
                    clientid: clientid
                }
            });
        return true;
        //TODO: return?
    } catch(err) {
        console.log(err);
    }
}