const http = require('http');
const request = require('request');

const listening_port = 8080;
const doomsday_clock_service_name = process.argv[2] || 'doomsday-clock.default.svc.cluster.local';
const doomsday_clock_service_port = process.argv[3] || 8080;
const doomsday_clock_service_url = process.argv[4] || '/time';
const frontend_msg = 'Doomsday clock says: ';
const clock_svc_uri = "http://" + doomsday_clock_service_name + ":" + doomsday_clock_service_port + "/" + doomsday_clock_service_url;

const server = http.createServer((req, res) => {
  let onReqTime = Date.now();
  let reqAttr = {
    method: req.method,
    url: req.url,
    rawHeaders: req.rawHeaders,
    remoteAddress: req.socket.remoteAddress,
    remotePort: req.socket.remotePort,
    localAddress: req.socket.localAddress,
    localPort: req.socket.localPort
  };
  console.log('Doomsday frontend service received request attributes: ', reqAttr);
  req.resume();
  req.on('end', () => {
    console.log('Initiating request to doomsday-clock service');
    let onClockResTime = 0;
    request(clock_svc_uri, (err, response, body) => {
      if (err) {
        console.log('Received error from clock service:', err);
        res.statusCode = 503;
        res.end('Clock service not available, error:' + err.message);
      } else {
        res.end(frontend_msg + body + '\n');
        let onResEndTime = Date.now();
        console.log('Time taken between receiving response headers and last byte from clock service: ', onResEndTime - onClockResTime, 'ms');
      }
    }).on('response', (clockResp) => {
      onClockResTime = Date.now();
      let clockRespAttr = {
        statusCode: clockResp.statusCode,
        statusMessage: clockResp.statusMessage,
        rawHeaders: clockResp.rawHeaders,
        remoteAddress: clockResp.socket.remoteAddress,
        remotePort: clockResp.socket.remotePort,
        localAddress: clockResp.socket.localAddress,
        localPort: clockResp.socket.localPort
      };
      console.log('Received response from doomsday-clock service with attributes: ', clockRespAttr);
    });
  });
  res.on('finish', () => {
    let onResFinishTime = Date.now();
    console.log('Time taken between receiving request headers and sending last response bytes: ', onResFinishTime - onReqTime, 'ms');
  });
});

server.listen(listening_port, '0.0.0.0', () => {
  console.log('Doomsday frontend server is listening on: ', server.address().address, server.address().port);
});
