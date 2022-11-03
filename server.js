'use strict';

console.log('first server');

const { response } = require('express');
// **requires**
console.log

const express = require('express');
require('dotenv').config();
const axios = require('axios');
const cors = require('cors');

//once express is in/ app ===server
// **endpoints**
const app = express();

app.use(cors());
//define port
const PORT = process.env.PORT || 3002;
//3002, something wrong with .env or didn't bring in dotenv library

app.get('/', (request, response)=> {
    console.log('This is showing up in my terminal!');
    response.status(200).send('WELCOME TO THE CYBER JUNGLE!');
});

app.get('/weather', async(request, response, next) => {
	
	let lat = request.query.lat;
	let lon = request.query.lon; 
	try {
		let url=`http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&land=en&lat=${lat}&lon=${lon}&days=5`
		let cityData = await axios.get(url)
		let groomedData = cityData.data.data.map(day => new Forecast(day));
		console.log (groomedData)
		// map returns  an array of the date and description
	    response.status(200).send(groomedData);
	} catch(error) {
	next(error);
	}

});

class Forecast{
	constructor(dayObj){

	this.date= dayObj.datetime;
	this.description= dayObj.weather.description;
	}
}


//catchall should live at bottom of endpoint
app.get('*', (request,response)=>{
    response.status(404).send('This route does not exist');
});
// **Error handling**
app.use((error, request, response, next) => {
    response.status(500).send(error.message);
});


// **server start** 
app.listen(PORT, ()=> console.log(`We are up and running on port ${PORT}`));