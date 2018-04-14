#!/bin/bash

trap cleanup EXIT SIGKILL SIGTERM

cleanup() {
  echo "Getting logs from $frontendName container"
  docker logs $frontendName

  echo "Getting logs from $clockName container"
  docker logs $clockName

  docker rm -f $frontendName $clockName
  exit 0
}

scriptName=$(basename $0)
frontendName="doomsday-frontend"
clockName="doomsday-clock"
containerPort=8080
frontendHostPort=8080
clockHostPort=9090

docker rm -f $frontendName $clockName

set -e

docker build -t $frontendName -f frontend/Dockerfile frontend/
docker build -t $clockName -f clock/Dockerfile clock/

docker run --rm -d -ti -p $frontendHostPort:$containerPort --name $frontendName $frontendName "host.docker.internal" $clockHostPort
docker run --rm -d -ti -p $clockHostPort:$containerPort --name $clockName $clockName

while sleep 10; do \
  curl -H "x-b3-traceid: 0000111122223333" \
    -H "x-b3-spanid: 4444555566667777" "http://127.0.0.1:$frontendHostPort"
done
