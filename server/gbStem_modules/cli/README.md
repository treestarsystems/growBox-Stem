# GrowBox-Stem
These scripts can be ran from the cli to help troubleshoot issues or make quick settings changes.

## General Instructions:
1. make scripts executable with "chmod +x" 
2. run using ./<script name>


## Options:
###### readgpio.gbstem.js: Reads Gpio pin's current state\n 
* --gpio - Please enter a valid 
* --gpio <GPIO.BMC> number 
* Example: ./readgpio.gbstem.js --gpio 5

###### relaycontrol.gbstem.js: Change Gpio pin's current state. Mainly for relays. 
* --gpio - Please enter a valid --gpio <GPIO.BMC> number 
* --task - Please enter a valid --task on|off 
* Example: ./readgpio.gbstem.js --gpio 5 --task on

###### sysstatmessages.gbstem.js: Write system status information to the main console window. /dev/tty1
