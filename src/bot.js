// const express = require('express');
const Cid = require('./models/Subcat');
const {
    Op
} = require('sequelize');
const Dotenv = require('dotenv');
const Telegraf = require('telegraf');
// const fetch = require('node-fetch');
// const {
//     Extra,
//     Markup
// } = Telegraf;
require('./database');
Dotenv.config({
    path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env"
});
// const app = express();
// app.use(express.json());
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.telegram.getMe().then((bot_informations) => {
    bot.options.username = bot_informations.username;
    console.log("Server has initialized bot nickname. Nick: " + bot_informations.username);
});

bot.on('inline_query', async ({
    inlineQuery,
    answerInlineQuery
}) => {
    const queryLength = inlineQuery.query.length;
    if (queryLength >= 4) {
        try {
            const offSet = inlineQuery.offset;
            let nextOffSet = offSet;
            console.log("Query usuário: " + inlineQuery.query);
            const response = await Cid.findAll({
                attributes: ["subcat", "descricao"],
                where: {
                    descricao: {
                        [Op.iLike]: "%" + inlineQuery.query + "%",
                    },
                },
            });
            let listCid = response;
            console.log(`*** Array listCID com ${listCid.length} elementos.`);
            if (offSet === '') {
                console.log(`OFFSET inicial: ${offSet}`);
                // if (listCid.length > 50) {
                //     console.log('Numero de ítens > 50');
                //     // nextOffSet = parseInt(offSet) + 50;
                //     // nextOffSet = offSet;
                //     nextOffSet = offSet;
                //     listCid = listCid.slice(parseInt(offSet), nextOffSet);
                // } else if (listCid.length <= 50) {
                console.log('Numero de ítens <= 50');
                // nextOffSet = offSet;
                nextOffSet = '50';
                // listCid = listCid.slice(0, listCid.length);
                listCid = listCid.slice(0, 50);
                // };
            } else if (offSet != '') {
                console.log('cheguei no ELSE IF');
                console.log(`Este é o valor de OFFSET: ${offSet} do tipo: ${typeof offSet}`);
                nextOffSet = parseInt(offSet) + 50;
                listCid = listCid.slice(parseInt(offSet), parseInt(nextOffSet));
            };
            const recipes = listCid.map(({
                subcat,
                descricao
            }) => ({
                type: "article",
                id: subcat,
                title: subcat,
                description: descricao,
                input_message_content: {
                    message_text: subcat + " " + descricao
                },
            }));
            return answerInlineQuery(JSON.stringify(recipes), {
                cache_time: 10,
                is_personal: true,
                next_offset: nextOffSet,
            });
        } catch (error) {
            console.log(`Falha ao processar sua requisição.: ${error}`);
        }
    }
});
bot.startPolling();