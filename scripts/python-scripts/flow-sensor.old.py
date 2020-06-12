#For GrowBox-Stem (Environment Controller)
import time, sys
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
GPIO.setup(13,GPIO.IN)

rate_cnt = 0
tot_cnt = 0
minutes = 0
constant = 0.10
time_new = 0.0

print('Water Flow - Approximate')
print('Control C to exit')

try:
	while True:
		if GPIO.input(13)!= 0:
		   rate_cnt += 1
		   tot_cnt += 1
		   print(GPIO.input(13), end='')
		   print('\nLiters / min ', round(rate_cnt * constant,4))
		   print('Total Liters ', round(tot_cnt * constant,4))
		   print('Time (min & clock) ', minutes, '\t', time.asctime(time.localtime(time.time())),'\n')
		   time.sleep(5)

except KeyboardInterrupt:
	GPIO.cleanup()
	sys.exit()
