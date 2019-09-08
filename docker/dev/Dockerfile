FROM node:10

USER root

WORKDIR /usr/src/app


COPY package.json /usr/src/app

COPY yarn.lock /usr/src/app

RUN yarn install

COPY . .

EXPOSE 4220


ENTRYPOINT [ "yarn", "watch-ts" ]
