import { Telegraf, Context } from "telegraf";
import { Message } from "typegram";
import chron from "node-cron";
import { GasType, SortType, tankKoenigApi } from "./tanken-api";

let e5Threshold = 1.45;
const bot = new Telegraf("1854406302:AAEjtuKxhdhu8HhaQ1JXu-nPNOpboPHPfi8");

chron.schedule("*/15 * * * *", async () => {
  tankKoenigApi
    .getStationsByLocation(
      50.963604,
      7.142388,
      5,
      SortType.Price,
      GasType.E5
    )
    .then((data) => {
      data.stations?.forEach((station) => {
        const price = station.e5 ?? station.price;
        if (price && price < e5Threshold) {
          bot.telegram.sendMessage(
            -534885489,
            `Es wurde eine Tankstelle mit einem Preis von ${station.e5}€ gefunden.\n
                Name: ${station.name}
                Adresse: https://maps.google.com/?ll=${station.lat},${station.lng}`
          );
        }
      });
    });
});

bot.command("chatid", (ctx: Context) =>
  ctx.reply(`Dieser Chat hat die Chat-Id: ${ctx.chat?.id}`)
);
bot.command("setPriceE5", (ctx: Context) => {
  const msg = ctx.message as Message.TextMessage;
  const args = msg.text.split(" ");
  try {
    if (args.length < 2)
      throw "Incorrect use of this command!\nUsage: /setPriceE5 {price}\nExample: /setPriceE5 1.45";
    const price = Number.parseFloat(args[1]);
    if (isNaN(price)) throw "The price has to be a number!";
    e5Threshold = Number.parseFloat(args[1]);
    ctx.reply(`Set price to ${e5Threshold}€`);
  } catch (error) {
    ctx.reply(error);
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
