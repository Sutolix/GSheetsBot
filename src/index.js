require('dotenv').config({path:__dirname+'/../.env'})

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const gsheets = require ('./gsheetsApi');
// console.log(gsheets.getSheetData());

const app = express();
app.use(express.json());

const token = process.env.BOT_API;
const bot = new TelegramBot(token, {polling: true});

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

bot.onText(/\/start/, async (msg, match) => {
  const chatId = msg.chat.id;
  const chatType = msg.chat.type;
  const username = msg.from.username;
  const created = msg.date;

  let resp = '';
  const users = await gsheets.getUsersData();

  if(users.some(e => e.chatId == chatId)) {
    resp = 'Identificamos que você já se cadastrou.'
  } else {
    gsheets.createUserRow(chatId, chatType, created, username)
    resp = 'Agradecemos sua inscrição.'
  }

  bot.sendMessage(chatId, resp);
})

bot.onText(/\/email (.+)/, async (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const sheet = await gsheets.getSheetData();
  const chatId = msg.chat.id;
  const email = match[1];
  const data = sheet;
  let resp = 'E-mail desconhecido.';

  if(validateEmail(email)) {
    data.forEach((i) => {
      if(i.email === email) {
        resp = 'Este e-mail está cadastrado em nosso sistema!';
      }
    })
  } else {
    resp = 'Por favor, digite um e-mail válido.'
  }


  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});

app.listen(process.env.PORT || 3333);
