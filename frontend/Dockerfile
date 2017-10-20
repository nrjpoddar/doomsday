FROM node:8.3.0

ENV APPDIR /app

WORKDIR $APPDIR

RUN apt-get update -y && \
    apt-get install -y tcpdump

COPY package.json $APPDIR/

ENTRYPOINT [ "node", "index.js" ]

ADD index.js $APPDIR/
