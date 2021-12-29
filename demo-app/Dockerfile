FROM timbru31/java-node:latest

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

ADD ./schema.yaml /usr/src

RUN yarn --pure-lockfile

RUN yarn openapi

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]