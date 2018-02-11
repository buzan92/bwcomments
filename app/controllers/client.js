'use strict';
import Client from '../models/client'

export const getClient = async(id) => {
    try {
        let result = await Client.findOne({id: id})
        .catch(err => {
            throw new Error('Error while find client from DB');
        })
        return result;
    } catch(err) {
        console.log(err);
    }
}


export const getClientCount = async() => {
    try {
        let result = await Client.count()
        .catch(err => {
            throw new Error('Error while count clients from DB');
        })
        return result;
    } catch(err) {
        console.log(err);
    }
}

export const createClient = async(client) => {
    try {
        await client.save().catch(err => {
            throw new Error('Error while save new client into db');
        });
        return true;
        //TODO: return?
    } catch(err) {
        console.log(err);
    }
}