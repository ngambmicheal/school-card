FROM --platform=linux/amd64 node:16.15.1

RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

RUN sed -i '/openssl_conf/d' /etc/ssl/openssl.cnf

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .


EXPOSE 3000

CMD [ "yarn", "dev" ]