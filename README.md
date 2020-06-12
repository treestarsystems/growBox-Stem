# growBox - Stem
Environmental control system for container farms. A subsystem that will control and monitor lighting, water (pumps, flow sensors, irrigation), and ventilation. 
### Site: [The growBoxProject](http://thegrowboxproject.com)
### growBox - Stem Documentation: [The growBoxProject Documentation](https://mjnshosting.atlassian.net/wiki/spaces/MKB/pages/1252950017/Stem)
### YouTube: [growBoxProject Playlist](https://www.youtube.com/watch?v=eSyloLOebXA&list=PLFwrukKhzwLi123Tsg_ZXVXs2WnTBKwnU)


#Work in progress
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
curl -sL https://deb.nodesource.com/setup_12.x | bash -E
apt update
apt -y upgrade
apt install -y nmap whois rsync screen git build-essential npm nano openssl gnupg
apt install -y nodejs
npm install -g pm2
npm install -g node-gyp
