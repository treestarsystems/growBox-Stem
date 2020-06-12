#For GrowBox-Stem (Environment Controller)
import time
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
GPIO.setup(7,GPIO.OUT)

GPIO.cleanup()
