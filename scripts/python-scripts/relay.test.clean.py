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

GPIO.cleanup()
