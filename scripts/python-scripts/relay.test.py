#For GrowBox-Stem (Environment Controller)
import time
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
GPIO.setup(29,GPIO.OUT)
GPIO.setup(31,GPIO.OUT)
GPIO.setup(32,GPIO.OUT)
GPIO.setup(33,GPIO.OUT)
GPIO.setup(35,GPIO.OUT)
GPIO.setup(36,GPIO.OUT)
GPIO.setup(37,GPIO.OUT)
GPIO.setup(38,GPIO.OUT)

def relay_off():
	GPIO.output(29,GPIO.HIGH)
	GPIO.output(31,GPIO.HIGH)
	GPIO.output(32,GPIO.HIGH)
	GPIO.output(33,GPIO.HIGH)
	GPIO.output(35,GPIO.HIGH)
	GPIO.output(36,GPIO.HIGH)
	GPIO.output(37,GPIO.HIGH)
	GPIO.output(38,GPIO.HIGH)

def relay_on():
	GPIO.output(29,GPIO.LOW)
	GPIO.output(31,GPIO.LOW)
	GPIO.output(32,GPIO.LOW)
	GPIO.output(33,GPIO.LOW)
	GPIO.output(35,GPIO.LOW)
	GPIO.output(36,GPIO.LOW)
	GPIO.output(37,GPIO.LOW)
	GPIO.output(38,GPIO.LOW)

x = 0
while x < 5:
	relay_off()
	relay_on()
	time.sleep(1)
	relay_off()
	time.sleep(1)
	x += 1

GPIO.cleanup()
