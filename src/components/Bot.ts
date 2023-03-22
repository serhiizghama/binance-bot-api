import TelegramBot from 'node-telegram-bot-api';
import { BinanceLogic } from './binanceLogic';

export class Bot {
    private bot: TelegramBot;
    private binance: BinanceLogic | undefined;
    private owner: number | null = null;

    constructor(token: string) {
        this.bot = new TelegramBot(token, { polling: true });
    }

    public async start() {
        this.bot.onText(/^\/go$/, async (msg) => await this.handleGo(msg.chat.id));
        this.bot.onText(/^\/start$/, async (msg) => await this.handleStart(msg.chat.id));
        this.bot.onText(/^\/volatility$/, async (msg) => await this.handleVolatility(msg.chat.id));

        const commands = [
            { command: '/startgame', description: 'Start' },
            { command: '/volatility', description: 'Volatility' },
        ];

        await this.bot.setMyCommands(commands);


        this.bot.on('callback_query', async (callbackQuery) => {
            if (!callbackQuery) return;
            const chatId = callbackQuery.message?.chat.id;
            const data = callbackQuery.data;

            if (data === '/volatility') {
                await this.handleVolatility(chatId!);
            }
        });
    }

    private async handleGo(chatId: number) {
        if (!this.owner) {
            this.owner = chatId;
        }
        if (this.owner !== chatId) {
            await this.bot.sendMessage(chatId, 'You don\'t owner');
            return;
        }

        this.getBinance().worker();
        await this.bot.sendMessage(chatId, 'OK');
    }

    private async handleStart(chatId: number) {
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Volatility', callback_data: '/volatility' }]
                ]
            }
        };
        await this.bot.sendMessage(chatId, 'Выберите действие:', options);
    }

    private async handleVolatility(chatId: number) {
        try {
            console.log("volatility...");
            await this.bot.sendMessage(chatId, 'Calculator...');

            const result = await this.getBinance().getVolatility();

            const sort = result.sort((a: any, b: any) => b.averagePercent - a.averagePercent);

            const firstTenElements = sort.slice(0, 50);

            const message = firstTenElements.map((c: any) => `*${c.pair}* - ${c.averagePercent.toFixed(2)}% - ${(+c.volume).toFixed(2)}\n`).join("");

            const updateDate = this.getBinance().getUpdateDate();
            const now = new Date();
            const diffInMs = Math.abs(now.getTime() - updateDate.getTime()); // вычисляем разницу в миллисекундах
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // переводим миллисекунды в минуты

            await this.bot.sendMessage(chatId, `${message}\nThe data was updated ${diffInMinutes} minutes ago.`, { parse_mode: "Markdown" });
        } catch (e: any) {
            console.error(e.message);
        }
    }

    private getBinance(): BinanceLogic {
        if (!this.binance) {
            this.binance = new BinanceLogic();
        }
        return this.binance;
    }
}
