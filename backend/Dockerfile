FROM node:16-alpine
WORKDIR /app
COPY ./package.json /app/
RUN yarn
COPY . /app/
EXPOSE 9000
# IMPORTANT TIP: https://dev.to/hugodias/wait-for-mongodb-to-start-on-docker-3h8b
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && yarn start