const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');
const express = require('express')
const config = require("./config");
const app = express()
const cors = require('cors');

app.use(cors())

PORT = 8000

var Full_News = '';
Heading = '';

const url = 'https://www.manoramaonline.com/';


function whatsapp() {
	const wa = require('@open-wa/wa-automate');

	wa.create({
		sessionId: "NEWS_BOT",
		multiDevice: false, //required to enable multiDevice support
		authTimeout: 120, //wait only 60 seconds to get a connection with the host account device
		blockCrashLogs: true,
		disableSpins: true,
		headless: true,
		hostNotificationLang: 'en_IN',
		logConsole: false,
		popup: true,
		qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
	}).then(client => start(client));

	function start(client) {
		client.onMessage(async message => {
			await scrapNews('https://www.manoramaonline.com/');
			if (Full_News != '') {
				await client.sendText(config.wa_grp_id, Full_News);
				console.log(message.from);
				Full_News = '';
			}
		});
	}
}



async function scrapNews(url){
	axios(url).then(async response => {
		const html = response.data;
		const $ = cheerio.load(html);
		var newses = [];
		$('.content-ml-001', html).each(function() {
			heading = $(this).find('a').attr('title');
			short = $(this).text();
			link = $(this).find('a').attr('href');

			newses.push({
				heading: heading,
				short: short,
				link: link
			});
		});
		newsHead = await newses[0].heading;
		newsBody = await newses[0].short.trimStart();
		pageLink = await newses[0].link;

		if(Heading === newsHead){
			console.log('No new news');
			//await sleep(50000);
			Full_News = '';
		}
		else{
			var FullNews = `*${newsHead}* \n\n_${config.wa_grp}_\n\n_${newsBody}_ \n_Read More:_\n_${pageLink}_`;
			Heading = newsHead;
			Full_News = FullNews;
		}
	});
}

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

whatsapp()

app.get('/', (req, res) => {
	axios(url).then(response => {
		const html = response.data;
		const $ = cheerio.load(html);
		var newses = [];
		$('.content-ml-001', html).each(function() {
			heading = $(this).find('a').attr('title');
			short = $(this).text().trimStart();
			link = $(this).find('a').attr('href');

			newses.push({
				heading: heading,
				short: short,
				link: link
			});
		});
		console.log(newses[0]);
		var fNewses = [];
		for(var i = 0; i < 5; i++) {
			fNewses.push({
				heading: newses[i].heading,
				short: newses[i].short,
				link: newses[i].link
			});
		}
		//res.json(fNewses);
		res.sendFile('index.html', { root: '.' });
	});
	
})

app.listen(process.env.PORT || 5000, () => {console.log(`Server Running Port http://localhost:${PORT}/`)})