const http = require('http');

const listening_port = 8080;
const time = process.argv[2] || 'Ten minutes';
const clock_msg = time + ' to midnight';


const server = http.createServer( (req, res) => {
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
  console.log('Doomsday clock service received request attributes: ', reqAttr);
  req.resume();
  req.on('end', () => {
    res.end(clock_msg);
  });
  res.on('finish', () => {
    let onResFinishTime = Date.now();
    console.log('Time taken between receiving request headers and sending last response bytes: ', onResFinishTime - onReqTime, 'ms');
  });
});

server.listen(listening_port, '0.0.0.0', () => {
  console.log('Doomsday clock server is listening on: ', server.address().address, server.address().port);
});
