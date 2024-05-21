FROM --platform=linux/amd64 node:16.15.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .


EXPOSE 3000

CMD [ "yarn", "dev" ]