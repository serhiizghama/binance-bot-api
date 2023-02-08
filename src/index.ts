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
                    [{ text: 'BNB', callback_data: `id1098` },{ text: 'Список', callback_data: `Spisok` }],
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

                       // console.log(tickerPrice[i])
                        request(`https://www.binance.com/api/v3/ticker/24hr`, async function (error, response, body2) {

                            let tickerPrice2 = JSON.parse(body2);
                            let pl = ' ';
                           // console.log(tickerPrice2[i])
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

    if (data == 'Spisok') {


        request(`https://api.binance.com/api/v3/ticker/price`, async function (error, response, body) {
            let tickerPrice = JSON.parse(body);


            request(`https://www.binance.com/api/v3/ticker/24hr`, async function (error, response, body2) {

                let tickerPrice2 = JSON.parse(body2);
let cripta = [];

                for(let i = 0; i<2144;i++){

                    if(tickerPrice[i]['symbol'].toLowerCase().includes('usdt')){
                        let mon = {
                            'id': i,
                            'name': tickerPrice[i]['symbol'].substr(0, tickerPrice[i]['symbol'].length-4),
                            'symbol': tickerPrice[i]['symbol'],
                            'price':Math.round(tickerPrice[i]['price'] * 100) / 100,
                            'volume': Math.round(tickerPrice2[i]['volume'] * 100) / 100,
                            'volumeMani':Math.round(tickerPrice2[i]['volume'] * tickerPrice[i]['price']*10) / 10,
                        }
                       // console.log(mon)
                        let textMsg;
function vol(n) {
    request(`https://api.binance.com/api/v1/klines?symbol=${tickerPrice[n]['symbol']}&interval=5m`, async function (error, response, body3) {
        let tickerPrice3 = JSON.parse(body3);
        let volatility = 0;
        for(let i = 487; i < 500;i++){
           // console.log(new Date(tickerPrice3[i][0]+10800000))
let izmPrice = Math.round((tickerPrice3[487][2]-mon['price']) * 100) / 100;
            let pl = ' ';
            // console.log(tickerPrice2[i])
            if (izmPrice > 0) {
                pl = '+';
            }
if(i==487){
    console.log(izmPrice)
}

           //console.log(Math.round((tickerPrice3[i][2]-tickerPrice3[i][3]) * 100) / 100)
            volatility = volatility + Math.round((tickerPrice3[i][2]-tickerPrice3[i][3]) * 100) / 100;

            if(i==499){
                let srVol = (Math.round(volatility * 100) / 100)/13;
                let procent = srVol/mon['price']*100;
//\n\n${new Date(tickerPrice3[499][0])}
                //\nОбъем за 24 часа: ${mon['volumeMani']}$
                await bot.sendMessage(chatId, `${mon['name']} (${mon['price']}$) ${pl}${izmPrice}$\nИзменения: ${Math.round(procent * 100) / 100}% (${Math.round(srVol * 100) / 100}$)`, {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                           // [{ text: 'Список', callback_data: `Spisok` }],
                            // {text: `⚙ Настройки`, callback_data: `dr${nomContent}:1:1`},
                            // [delBut],
                        ]
                    })
                });
            }

        }

       // console.log(mon)


    })
}
                    if(i == 11){
                        vol(11)
                    }
                        if(i == 12){
                            vol(12)
                        }
                        if(i == 98){
                            vol(98)
                        }
                        if(i == 190){
                            vol(190)
                        }
                       // if(i == 350){
                       //     vol(350)
                        //}
                       // if(i == 296){
                            //vol(296)
                       // }

                        //console.log(tickerPrice[i]['symbol'].substr(0, tickerPrice[i]['symbol'].length-4),'|',i,'|',Math.round(tickerPrice[i]['price'] * 100) / 100,'|',Math.round(tickerPrice2[i]['volume'] * tickerPrice[i]['price']*10) / 10,'$ ')
                    }

                }

                //bot.sendMessage(chatId, `${tickerPrice[i]['symbol'].toUpperCase()} цена: ${Math.round(tickerPrice[i]['price'] * 100) / 100}$ (id${i})\nОбъем за 24 часа: ${Math.round(tickerPrice2[i]['volume'] * 100) / 100} монет\nИзменение цены за 24 часа: ${pl}${Math.round(tickerPrice2[i]['priceChange'] * 100) / 100}$\n`);
            });
        });
    }
});

console.log("Bot started...");