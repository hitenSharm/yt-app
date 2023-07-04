# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port that the Nest.js application listens on
EXPOSE 8080

# Set environment variables
ENV MONGO_URI=mongodb://mongo:27017/youtube
ENV API_KEY_PRIMARY=AIzaSyBrJOcd1zXxNIkThgYqC901l3cyPV9xZGg
ENV API_KEY_SECONDARY=AIzaSyDrllJofJNHcOAke-S6DeV_zxHPYRt0rwg
ENV TAG=music

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
