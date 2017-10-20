## Introduction
Doomsday is a simple application which provides users with current doomsday
time. It uses microservices architecture and is composed of following
microservices:

* *Frontend* - This application exposes the doomsday application to the users. It
communicates with clock microservice to return the current doomsday time back
to users. User requests with any method (GET, PUT, POST or DELETE) to any path
return the same message back to user with 200 OK HTTP status code.

* *Clock* - This application returns the current doomsday time to the frontend
microservice. Currently, the time is statically configured to be `Ten minutes to
midnight`.

### Transaction Logging
Both the microservices currently log the following attributes for every request
received:
* Request Method
* Request URL
* Request Raw Headers as received on wire
* Remote address and port of client
* Local address and port of socket
* Time between receiving the request headers from client and sending last byte
of response back to the client.

### Usage
In order to create this application in kubernetes use the following
instructions:
```bash
kubectl apply -f scripts/doomsday.yaml
```
