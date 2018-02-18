'use strict';
import Comment from '../models/comment'
import * as ctrl from '../controllers/comment'
import { reply } from '../telegrambot'

export default router => {
    router
        .post('/api/getcomments/', getCommentsByClientId)
        .post('/api/replycomment/', replyComment)
//        .post('/api/client/', createClientApi)
//      .post('/categories', mw.verifyToken, create)
//      .get('/categories', allCategory)
//      .patch('/categories/:id', mw.verifyToken, modify)
//      .delete('/categories/:id', mw.verifyToken, deleteCat)
}

async function getCommentsByClientId(ctx, next) {
    let data = {}, success = false;
    const { clientid } = ctx.request.body;
    let comments = await ctrl.getCommentsByClientId(clientid)
    if (comments) {
        success = true;
        data = comments;
    } 
    ctx.body = {
        success: success,
        data: data
    }
    await next();
}

async function replyComment(ctx, next) {
    let msg = '', success = false;
    const { commentid, chatid, msgid, content } = ctx.request.body;
    if (commentid && chatid && msgid && content) {
        const replymsg = await reply(chatid, content, msgid);
        const result = await ctrl.replyComment(commentid, replymsg.date, content);
        if (result) {
            success = true;
            msg = 'Ответ на отзыв успешно отправлен';
        }
    } else {
        msg = 'Произошла ошибка, попробуйте свой запрос позже';
    }
    ctx.body = {
        success: success,
        msg: msg
    }
    await next();
}
/*
async function createClientApi(ctx, next) {
    const { orgname } = ctx.request.body;
    let success = false;
    let msg = 'Упс, произошла ошибка. Мы уже работаем над ней, попробуйте свой запрос позже';
    if (orgname) {
        let id = await getClientCount();
        let newClient = new Client({
            id: ++id,
            orgname: orgname,
            createdate: Date.now()
        });
        await newClient.save().catch(err => {
            throw new Error('error while add new client into db');
        });
        success = true;
        msg = 'Создание пользователя прошло успешно';
    }
    ctx.body = {
        success: success,
        message: msg
    }
}
*/