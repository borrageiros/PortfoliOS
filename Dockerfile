FROM node:22
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build
EXPOSE 4173
CMD ["yarn", "serve"]