import TelegramBot from 'node-telegram-bot-api'
import config from 'config'
import User from './models/user'
import Comment from './models/comment'
import { getClient } from './controllers/client'
import { getUser, createUser, updateUserState } from './controllers/user'
import { createComment } from './controllers/comment'

const TOKEN = config.app.telegramToken;
export const bot = new TelegramBot(TOKEN, { polling: true });

const startMsg = 'Сервис анонимных отзывов';
const start = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '📝 Оставить отзыв', callback_data: 'addComment' }],
            [{ text: '❔ О сервисе', callback_data: 'help' }]
        ]
    }
}
const addCommentMsg = 'Введите номер заведения (Например "1" без кавычек, чтобы написать нам)';

const helpMsg = 
`
Сервис анонимных отзывов <b>AnonComments_bot</b>
Для начала работы введите <a href="/start">/start</a>
<a href="http://baikal-web.ru">О проекте</a>
`;

const invalidOrgname = 
`
Не найдено ни одной организации с таким номером, попробуйте ввести еще раз.
Для возврата введите <a href="/start">/start</a>
`;

const thankyouMsg = '✅ Отзыв отправлен и будет обязательно прочитан! Спасибо за обратную связь и удачного дня!';
const invalidComment = 
`
На данный момент Вы можете написать текстовый отзыв или прикрепить фотографию. Отправьте ваш отзыв еще раз!
Для возврата введите <a href="/start">/start</a>
`;

const errorMsg = 
`
Ой, что-то пошло не так, попробуйте свой запрос позже.
Для возврата введите <a href="/start">/start</a>
`;

bot.onText(/\/start/, async function(msg, match) {
    await updateState(msg.chat.id, msg.from, 'start');   
    bot.sendMessage(msg.chat.id, startMsg, start);
});

bot.onText(/\/help/, (msg, match) => {
    bot.sendMessage(msg.chat.id, helpMsg, { parse_mode: 'HTML' });
});

bot.on('callback_query', async function (msg) {
    switch(msg.data) {
        case 'addComment':
            await updateState(msg.message.chat.id, msg.from, 'enterid');
            bot.sendMessage(msg.message.chat.id, addCommentMsg);
        break;
        case 'help':
            await updateState(msg.message.chat.id, msg.from, 'help');
            bot.sendMessage(msg.message.chat.id, helpMsg, { parse_mode: 'HTML' });
        break;
    }
});


bot.on('message', async function(msg) {
    if (msg.text && (msg.text === '/start') || (msg.text === '/help')) {
        return;
    }
    const currentUser = await getCurrentUser(msg.from, msg.chat.id);
    switch(currentUser.state) {
        case 'enterid':
            const org = (msg.text) ? await getOrg(msg.text) : false;
            if (org) {
                await updateState(msg.chat.id, msg.from, 'entercomment', org.id);
                bot.sendMessage(msg.chat.id, 
                    `Вы собираетесь оставить отзыв о "${org.orgname}". 
Для этого введите текст или добавьте фотографию с комментарием
Для отмены введите <a href="/start">/start</a>`,
                    {parse_mode: 'HTML'});
            } else {
                bot.sendMessage(msg.chat.id, invalidOrgname, {parse_mode: 'HTML'});
            }
        break;
        case 'entercomment':
            if (msg.text || msg.photo) {
                const success = await createNewComment(msg, currentUser.clientid);
                if (success) {
                    await updateState(msg.chat.id, msg.from, 'start');
                    bot.sendMessage(msg.chat.id, thankyouMsg);
                } else {
                    await updateState(msg.chat.id, msg.from, 'start');
                    bot.sendMessage(msg.chat.id, startMsg, start);
                    //bot.sendMessage(msg.chat.id, errorMsg, {parse_mode: 'HTML'});
                }
            } else {
                bot.sendMessage(msg.chat.id, invalidComment, {parse_mode: 'HTML'});
            }
        break;
        case 'start':
            bot.sendMessage(msg.chat.id, startMsg, start);
        break;
    }
});

const createNewComment = async function(msg, clientid) {
    let content = '',
        photo = '',
        success = false;
    if (msg.text) {
        content = msg.text;
    } else if (msg.caption) {
        content = msg.caption;
    }
    if (content === '/start') {
        return false;
    }
    try {
        if (msg.photo) {
            let photoId = msg.photo[msg.photo.length - 1].file_id;
            //const photoPath = __dirname + '/public/photo/' + photoId;
            //fs.mkdirSync(photoPath);
            let path = await bot.downloadFile(photoId, __dirname + '/public/photo/')
                .then(function (path) {
                    const filename = path.slice(path.lastIndexOf('/') + 1);
                    //photo = '/app/public/photo/' + photoId + '/' + filename;
                    photo = '/app/public/photo/' + filename;
                    console.log(photo);
            });
        }
        const comment = new Comment({
            clientid: clientid,
            chatid: msg.chat.id,
            type: 'review',
            createdate: msg.date,
            content: content,
            photo: photo
        });
        await createComment(comment);
        success = true;
    } catch(err) {
        console.log(err);
    }
    return success;
}
 

const getOrg = async function(msgtext) {
    const id = msgtext.trim();
    const client = await getClient(id);
    if (client) {
        return client;
    }
    return false;
}

const getCurrentUser = async function(from, chatid) {
    let user = await getUser(chatid);
    if (!user) {
        user = await createUser(newUser(from, chatid, 'start'));
    }
    return user;
}

async function updateState(chatid, from, state, clientid = 0) {
    let user = await getUser(chatid);
    if (user) {
        await updateUserState(chatid, state, clientid);
    } else {
        await createUser(newUser(from, chatid, state));
    }
}

const newUser = function(from, chatid, state) {
    try {
        const user = new User({
            chatid: chatid,
            isbot: from.is_bot,
            firstname: from.first_name,
            lastname: from.last_name,
            username: from.username,
            languagecode: from.language_code,
            state: state,
            clientid: 0
        });
        return user;
    } catch(err) {
        console.log(err);
    }
}


/*
bot.on('inline_query', query => {
    console.log('query: ${query}');
    const results = []

    for (let i = 0; i < 3; i++) {
        results.push({
            id: i.toString(),
            type: 'article',
            title: 'title #${i}',
            input_message_content: {
                message_text: 'Article msg text #${i}'
            }
        });
    }
    bot.answerInlineQuery(query.id, results, {
        cache_time: 0
    })
})
*/