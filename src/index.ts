import request from 'request';
import TelegramApi from 'node-telegram-bot-api';

// this library need for read config from .env file
import * as dotenv from 'dotenv';
dotenv.config();

const token: string = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramApi(token, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
});

bot.setMyCommands([{ command: '/start', description: '✅ Главная' }]);

bot.on('message', async msg => {
    let text2 = msg.text;

    const chatId = msg.chat.id;

    if (text2 == '/start') {
        bot.sendMessage(chatId, `Привет, напиши мне название криптовалюты.`, {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: 'BTC', callback_data: `id1011` }, { text: 'ETH', callback_data: `id1012` }],
                    [{ text: 'BNB', callback_data: `id1098` }],
                    // {text: `⚙ Настройки`, callback_data: `dr${nomContent}:1:1`},
                    // [delBut],
                ]
            })
        });
    }

    request(`https://api.binance.com/api/v3/ticker/price`, async function (error, response, body) {

        let tickerPrice = JSON.parse(body);
        if (text2.toLowerCase() != 'usdt') {

            for (let i = 0; i < tickerPrice.length; i++) {
                if (tickerPrice[i]['symbol'].toLowerCase().includes('usdt') && text2.length + 4 == tickerPrice[i]['symbol'].length) {

                    if (tickerPrice[i]['symbol'].toLowerCase().includes(text2.toLowerCase())) {

                        console.log(tickerPrice[i])
                        request(`https://www.binance.com/api/v3/ticker/24hr`, async function (error, response, body2) {

                            let tickerPrice2 = JSON.parse(body2);
                            let pl = ' ';
                            console.log(tickerPrice2[i])
                            if (tickerPrice2[i]['priceChange'] > 0) {
                                pl = '+';
                            }

                            bot.sendMessage(chatId, `${text2.toUpperCase()} цена: ${Math.round(tickerPrice[i]['price'] * 100) / 100}$ (id${i})\nОбъем за 24 часа: ${Math.round(tickerPrice2[i]['volume'] * 100) / 100} монет\nИзменение цены за 24 часа: ${pl}${Math.round(tickerPrice2[i]['priceChange'] * 100) / 100}$\n`);
                        });
                    }
                }
            }
        }
    });
});

bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data[0] == 'i' && data[1] == 'd') {

        let i = Number(`${data[2]}${data[3]}${data[4]}${data[5]}`) - 1000;
        request(`https://api.binance.com/api/v3/ticker/price`, async function (error, response, body) {
            let tickerPrice = JSON.parse(body);

            console.log(tickerPrice[i])
            request(`https://www.binance.com/api/v3/ticker/24hr`, async function (error, response, body2) {

                let tickerPrice2 = JSON.parse(body2);

                let pl = ' ';
                console.log(tickerPrice2[i])
                if (tickerPrice2[i]['priceChange'] > 0) {
                    pl = '+';
                }
                bot.sendMessage(chatId, `${tickerPrice[i]['symbol'].toUpperCase()} цена: ${Math.round(tickerPrice[i]['price'] * 100) / 100}$ (id${i})\nОбъем за 24 часа: ${Math.round(tickerPrice2[i]['volume'] * 100) / 100} монет\nИзменение цены за 24 часа: ${pl}${Math.round(tickerPrice2[i]['priceChange'] * 100) / 100}$\n`);
            });
        });
    }
});

console.log("Bot started...");