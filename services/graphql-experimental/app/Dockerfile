FROM node:23-alpine 
WORKDIR /usr/src/
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
COPY schema.graphql ./dist
EXPOSE 4000
CMD ["node", "dist/index.js"]
