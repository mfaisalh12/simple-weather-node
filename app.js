const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('index');
});

app.post('/', (req, res) => {
	const query = req.body.cityName;
	const apiKey = '1c61f0cacaa3c4dbeb99d25cb0158b9b';
	const unit = 'metric';
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${unit}`;

	https
		.get(url, (response) => {
			console.log('statusCode: ', response.statusCode);

			response.on('data', (data) => {
				const weatherData = JSON.parse(data);
				console.log(weatherData);
				const temp = weatherData.main.temp;
				const weatherDescription = weatherData.weather[0].main;
				const icon = weatherData.weather[0].icon;
				const imageURL =
					'http://openweathermap.org/img/wn/' + icon + '@2x.png';

				res.render('result', {
					weatherDescription: weatherDescription,
					image: imageURL,
					degree: query,
					temp: temp,
				});
			});
		})
		.on('error', (err) => {
			console.log(err);
		});
});

app.listen(3000, () => {
	console.log('Server running on port 3000');
});
