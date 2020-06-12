module.exports = {
 apps : [{
   name        : "growBox-Stem",
   script      : "server/index.js",
   watch       : true,
   cwd         : "/opt/growBox-Stem",
   instances   : "max",
   exec_mode   : "cluster",
   watch       : ["./server","./system_confs"],
   ignore_watch        : ["./log_storage","./db_storage"],
   out_file    : "./log_storage/growBox-Stem_out.log",
   error_file  : "./log_storage/growBox-Stem_err.log",
   pid_file    : "./log_storage/pid/growBox-Stem_id.pid",
   log_date_format     : "YYYY-MM-DD HH:mm Z",
   kill_timeout : 60000,
   env: {
     "NODE_ENV": "prod",
     "PORT": "3000",
     "HOST": "0.0.0.0"
   },
   env_dev : {
     "NODE_ENV": "dev",
     "PORT": "3100",
     "HOST": "0.0.0.0"
   }
 }]
}
