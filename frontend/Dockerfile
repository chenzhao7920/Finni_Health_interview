# Stage 1: Build React app
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# Copy the built React app to the Nginx html directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html
# Copy Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx will serve on
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
