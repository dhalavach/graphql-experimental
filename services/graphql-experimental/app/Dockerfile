FROM node:23-alpine 
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
COPY schema.graphql ./app/dist/
EXPOSE 4000
CMD ["node", "app/dist/index.js"]
