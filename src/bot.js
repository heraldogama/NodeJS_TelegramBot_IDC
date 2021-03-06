// const express = require('express');
const Cid = require("./models/Subcat");
const {
  Op
} = require("sequelize");
const Dotenv = require("dotenv");
const Telegraf = require("telegraf");
// const fetch = require('node-fetch');
// const {
//     Extra,
//     Markup
// } = Telegraf;
require("./database");
Dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env",
});
// const app = express();
// app.use(express.json());
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.telegram.getMe().then((bot_informations) => {
  bot.options.username = bot_informations.username;
  console.log(
    "Server has initialized bot nickname. Nick: " + bot_informations.username
  );
});

var result_Id = 0;

bot.on("inline_query", async ({
  inlineQuery,
  answerInlineQuery
}) => {
  const queryLength = inlineQuery.query.length;

  if (queryLength >= 4) {
    try {
      const offSet = inlineQuery.offset;
      // const resultId = inlineQuery.result_id;
      let nextOffSet = offSet;
      // let result_Id;
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
      if (offSet === "") {
        // PRIMEIRA PAGINA
        // AQUI result_Id = 0 (essa variável eu defini no início do código)
        // AQUI nextOffSet = "0" pois é a primeira página

        console.log(`OFFSET inicial: ${offSet}`);
        console.log("Numero de ítens <= 50");
        // result_Id = 0;
        // nextOffSet = "50";
        nextOffSet = "0";
        listCid = listCid.slice(0, 49); // PEGO <= 50 LINHAS
        console.log("Conteúdo offset==null result_id:" + result_Id);
      } else if (offSet != "") {
        // SEGUNDA PAGINA
        // AQUI EU INCREMENTO result_Id++
        // AQUI EU INCREMENTO nextOffSet em + 49 (nextOffSet é next_offset do answerInlineQuery)

        console.log("cheguei no ELSE IF");
        console.log(
          `Este é o valor de OFFSET: ${offSet} do tipo: ${typeof offSet}`
        );
        nextOffSet = parseInt(offSet) + 49; // INCREMENTO offset + 49
        result_Id++;

        /**
         * OBSERVE QUE AQUI EU ALIMENTO O VETOR listCid SOMENTE COM OS
         * DADOS CONFORME O ATUAL offSet e nextOffSet
         */

        listCid = listCid.slice(parseInt(offSet), parseInt(nextOffSet));
        console.log("Conteúdo offset<>null do result_Id:" + result_Id);
      }
      const recipes = listCid.map(({
        subcat,
        descricao
      }) => ({
        type: "article",
        // id: subcat,
        // id: String(nextOffSet) + "00" + subcat,
        id: subcat,
        title: subcat,
        description: descricao,
        input_message_content: {
          message_text: subcat + " " + descricao,
        },
      }));
      return answerInlineQuery(JSON.stringify(recipes), {
        // inline_query_id: resultId.toString(),
        result_id: result_Id,
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