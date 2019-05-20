/*
For GrowBox-Stem (Environment Controller)
Purpose - A collection of core functions
Inputs  -
Action  -
*/

function temperatureConversion(temperature, scale) {
	//From millidegree Celsius to Celsius
	if (scale == 'c') {
		return temperature/1000;
	}

	//From millidegree Celsius to Fahrenheit
	if (scale == 'f') {
		return ((temperature/1000)*9/5)+32;
	}

	//From millidegree Celsius to Kelvin
	if (scale == 'k') {
		return (temperature/1000)+273.15;
	}
}

//Generate a random alphanumeric string
function genRegular(x) {
        var regularchar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var text = "";

        for (var i = 0; i < x; i++)
                text += regularchar.charAt(Math.floor(Math.random() * regularchar.length));
        return text;
}

//Generate a random number within defined range
function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

module.exports = {
	genRegular,
	getRandomNumber,
	temperatureConversion
}
