FROM node:18-alpine

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Start the development server with hot reloading
CMD ["npm", "start"]