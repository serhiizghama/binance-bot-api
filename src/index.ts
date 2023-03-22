import { Bot } from "./components/Bot";

import * as dotenv from 'dotenv';
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) throw new Error("Dont have token");

const bot = new Bot(token);


bot.start();
console.log("Bot is started...")