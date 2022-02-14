import axios from 'axios';
import cron from 'node-cron';
import parse from 'node-html-parser';
import { Gotify } from 'gotify';

const gotifyClient = new Gotify({
  server: 'https://gotify.s0pex.me',
});

const sendPushMessage = (message: { title: string; message: string }) => {
  return gotifyClient.send({
    app: 'Ag8fWlPelQImiWl',
    title: message.title,
    message: message.message,
    priority: 5,
  });
};

cron.schedule('*/5 * * * *', async () => {
  const url =
    'https://www.lidl.de/p/kessebohmer-schreibtisch-elektrisch-hohenverstellbar/p100313116029';
  const res = await axios.get(url);

  const root = parse(res.data);
  const price_text = root.querySelector('.m-price__price')?.text;
  if (price_text != null) {
    const price = parseFloat(price_text);
    console.log(`Checked Lidl.de with price of ${price}`);
    if (price < 410) {
      await sendPushMessage({
        title: 'Lidl.de',
        message: `Der Kesseböhmer Schreibtisch ist wieder lieferbar.\nLink: ${url}`,
      });
    }
  }
});

// Enable graceful stop
//process.once("SIGINT", () => chron("SIGINT"));
//process.once("SIGTERM", () => bot.stop("SIGTERM"));
