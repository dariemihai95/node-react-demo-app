FROM node:16

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

ADD ./schema.yaml /usr/src

CMD ["npm", "install", "--global", "yarn"]

RUN yarn --pure-lockfile

COPY . .

EXPOSE 8080

CMD [ "yarn", "start" ]