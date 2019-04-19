//For GrowBox-Stem (Environment Controller)
const Gpio = require('onoff').Gpio;
const valve = new Gpio(5, 'out');

//Turning the realy on and off.
//0 = On|Low /1 = Off|High
const iv = setInterval(_ => valve.writeSync(valve.readSync() ^ 1), 5000); 
//valve.writeSync(1);

setTimeout(_ => {
  clearInterval(iv); // Stop blinking
  valve.unexport();    // Unexport GPIO and free resources
}, 20000);

//Clean free the Gpio pin for use again.
process.on('SIGINT', () => {
  valve.unexport();
});


