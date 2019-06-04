const SocketIO = require('socket.io');
const schedule = require('node-schedule');
const moment = require('moment');

module.exports = (server) => {
  var connections = [];
  const unique_name = 'time_job';

  const io = SocketIO(server, {
    transports: ['websocket']
  });
  io.on('connection', (socket) => {
    connections.push(socket);
    console.log('connection length:', connections.length);
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('접속! ip:', ip);
    socket.on('msg', (data) => {
      console.log(data.msg);
      let d = {};
      d.msg = 'server hi';
      socket.emit('msg', d);
    });
    socket.on('error', (error) => {
      console.log(error);
    });
    socket.on('disconnect', () => {
      connections.splice(connections.indexOf(socket), 1);
      console.log('disconnect length:', connections.length);
      // const my_job = schedule.scheduledJobs[unique_name];
      // if(my_job != null){
      //   my_job.cancel();
      // }
      console.log('접속 끝!');
    });
  });
  const scheduler = schedule.scheduleJob(unique_name, '*/1 * * * * *', function() {
    console.log('초:', moment().valueOf());
      io.emit('time', moment().valueOf());
    // for (let i = 0; i < connections.length; ++i) {
    //   connections[i].emit('time', moment().valueOf());
    // }
    // socket.emit('time', moment().valueOf());
  });
};
