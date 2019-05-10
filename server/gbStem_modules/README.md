# growBox - Stem
Modules that contain functions that can be imported for use.

## General Instructions:


#### core.gbstem.js: 
**A collection of core functions**
* Functions:
##### temperatureConversion(temperature, scale)
```
 Takes: temperature reading in millidegrees celcius (24000) and desired conversion ('c','f','k')- temperatureConversion(2400, 'c')
 Returns: converted value (24000, 'c') - 24.000
```
##### genRegular(x): Generate a random alphanumeric string
```
 Takes: number - genRegular(5)
 Returns: alphanumeric string - 5yA9w
```
##### getRandomNumber(min, max): Generate a random number within defined range
```
 Takes: range number - getRandomNumber(5,10)
 Returns: number - 3
```

#### gpio.gbstem.js: 
**Read/Write from/to GPIO pin**
* Functions:
##### readGpio (pin)
```
 Takes: GPIO BMC Pin number - readGpio(5)
 Returns: JSON object with success/error - Examples:
	Success: { "status": {"code": "200", "codeType": "success", "message": "Completed", "reading": 0 or 1}}
	Error: { "status": {"code": "500", "codeType": "error", "message": "Please enter a valid GPIO pin number - <GPIO.BMC> number"}}
```
##### writeGpio (pin)
```
 Takes:   - GPIO BMC Pin number - writeGpio(5)
 Returns: JSON object with success/error - Examples:
	Success: {"status": {"code": "200", "codeType": "success", "message": "Completed"}}
	  Note: You can run readGpio(5) again to get the value to see if it changed.
	Error: {"status": {"code": "500", "codeType": "error", "message": "Please enter a valid GPIO pin number - <GPIO.BMC> number"}}
```

#### relay.gbstem.js: 
**A collection of relay control functions**
 _Functions:_
##### relayControl (pin, task)
```
 Takes:   - GPIO BMC Pin number - relayControl (5, 'on'|'off')
 Returns: JSON object with success/error - Examples:
	Success: {"status": {"code": "200", "codeType": "success", "message": "Completed"}}
	  Note: You can run readGpio(5) to get the value to see if it changed.
	Error: {"status": {"code": "500", "codeType": "error", "message": "Please enter a valid GPIO pin number - <GPIO.BMC> number"}}
	Error: {"status": {"code": "500", "codeType": "error", "message": "Please enter a valid Task - on|off"}}
```

#### sensor.gbstem.js: 
**A collection of sensor data collection functions**
* Functions:
##### readSensorSingle (sensorID)
```
 Takes: Unique ID of sensor which can be found in /sys/bus/w1/devices/<device> - 
	readSensorSingle (28-011830a09cff)
		.then(console.log) <--- or whatever you want to do with the promise. 
 Returns: JSON object with parsed contents of w1_slave located beneath /sys/bus/w1/devices/<device>/ to return 
	  millidegree celsius
   Input:
	bc 01 4b 46 7f ff 0c 10 a4 : crc=a4 YES
	bc 01 4b 46 7f ff 0c 10 a4 t=27750
   Result: 
	Success: {"sensorID": {"reading": "27750"}}
	Error: {"28-011830a39bffs": {"reading": {"error": "Error: ENOENT: no such file or directory, open '/sys/bus/w1/devices/28-011830a39bffs/w1_slave'"}}}
```
##### readSensorAll ()
```
 Takes: Nothing - readSensorAll () 
 Returns: An array of JSON objects with parsed contents of w1_slave located beneath /sys/bus/w1/devices/<device>/ to return 
	  millidegree celsius
```

#### water.gbstem.js: 
**A collection of water control functions**
* Functions:
##### functionname
```
 Takes:   - 
 Returns:   - 
```

