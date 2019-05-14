# growBox - Stem
These scripts can be ran from the cli to help troubleshoot issues or make quick settings changes.

## General Instructions:
1. make scripts executable with "chmod +x" 
2. run using ./<script name>


## CLI Scripts:
#### readgpio.gbstem.js: 
**Reads Gpio pin's current state**
* --gpio - Please enter a valid --gpio <GPIO.BMC> number 

Example: 
```
./readgpio.gbstem.js --gpio 5
```

#### relaycontrol.gbstem.js: 
**Change Gpio pin's current state. Mainly for relays.** 
* --gpio - Please enter a valid --gpio <GPIO.BMC> number 
* --task - Please enter a valid --task on|off 

Example: 
```
./readgpio.gbstem.js --gpio 5 --task on
```

#### sysstatmessages.gbstem.js: 
**Write system status information to the main console window. /dev/tty1**

Example:
```
./sysstatmessages.gbstem.js --gpio 18 --cli 1 --file ./reading.json
```
Output:
```
growBox - Stem (Environmental Control System) 

Current Time: Tue, May 14, 2019, 3:06:44 AM EDT 
Hostname: raspberrypi 
Uptime: 23 Mins
Total Momory: 972 MBs

Disk Usage: 
 -Path: / 
 --Free: 57.23 GBs
 --Total: 59.75 GBs
 --Used: 4%

Network Interface Information:
 -Name: eth0: 
 --MAC: b8:27:eb:a3:18:51 
 --Address 0: 10.201.1.11/24 
 --Address 1: 2001:5b8:3:0:1a8a:d598:1e01:6025/64 
 --Address 2: fe80::afb7:ca2f:f41a:2256/64 
undefined


Task Info:
 -growBox - Root (Task Master):
 --Name: root-1fPUas 
 --IP Address: 19.168.1.1 
 --Last Communication: Thu, May 2, 2019, 2:02:51 AM EDT 

Current Tasks:
 -Water: Reservoir Valve Open
 -Light: On
 -Air: On - Cooling to 72 F

Scheduled Tasks:
 -Water: Irrigation - On - Tue, May 14, 2019, 3:06:44 AM EDT 
 -Light: Off - Tue, May 14, 2019, 3:06:44 AM EDT 
```

#### waterflowmonitor.gbstem.js:
**CLI script to monitor water flow.**
* --gpio <GPIO BMC Pin number> - required
* --cli 1 - optional and only takes effect if value is 1 - outputs JSON obj to console
* --file <path to file> - optionla must be a valid and writable path to output JSON obj
 Returns:  Writes JSON content to file and/or console. (Wish I didnt have to do this but my current skills/knowledge is limited)

Example:
```
./waterflowmonitor.gbstem.js --gpio 18 --cli 1 --file ./reading.json
```
 Output:
```
        { constant: 0.1,
	startTime: '1557815480',
	now: '1557815481',
	rateCount: 64,
	totalCount: 64,
	flowRate: '0.11',
	time: 0 }
```
