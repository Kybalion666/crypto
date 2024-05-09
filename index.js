import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import { createHash } from 'crypto';
import dotenv from "dotenv";
dotenv.config()
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

//API Payoki
const shop = 11760;
const currency = 'RUB';
const desc = 'Litecoin';
const secret = process.env.SECRET_KEY;
const method = 'ethereum'

const start = () => {
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Добро пожаловать , тут пока все в разработке, если хотите поддержать проект то у вас есть возможность задонатить в криптовалюте LTC :', {
            reply_markup: {
                keyboard: [
                    ['Донат']
                ]
            }
        });
    });

    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;


        if (text === 'Донат') {
        
            bot.sendMessage(chatId, 'Введите сумму в рублях чтобы поддержать нас (от 10р)');
        }
    });

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        const amount = parseFloat(text);
        const payment = Math.floor(Math.random() * 9000) + 1000
        if (isNaN(amount) || amount < 10) {
            bot.sendMessage(chatId, 'Сумма должна быть числом и не меньше 10р');
            return;
        }

        try {
            // параметрамы для хеширования
            const paramsString = `${amount}|${payment}|${shop}|${currency}|${desc}|${secret}`;

            // Вычисляем хэш
            const sign = createHash('md5').update(paramsString).digest('hex');

            // get request from payoki
            const paymentUrl = `https://payok.io/pay?amount=${amount}&payment=${payment}&desc=${desc}&shop=${shop}&currency=${currency}&sign=${sign}`;
            const response = await axios.get(paymentUrl);

        
            bot.sendMessage(chatId, `Ссылка для оплаты: ${response.request.res.responseUrl}`);
        } catch (error) {
            console.error('Ошибка при создании ссылки для оплаты:', error);
            bot.sendMessage(chatId, `Произошла ошибка при создании ссылки для оплаты.`);
        }
    });
}


start();





