FROM node:16-alpine
ENV NODE_ENV development
WORKDIR /app
COPY ./package.json /app/
COPY ./yarn.lock /app/
COPY yarn.lock /app/
RUN yarn
COPY . /app/
EXPOSE 3000
CMD ["yarn", "start"]
