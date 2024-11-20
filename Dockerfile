# Step 1: Build the Angular app using Node.js
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the container's /app directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the Angular app source code into the container
COPY . .

# Build the Angular app for production
RUN npm run build --prod

# Step 2: Serve the Angular app using Nginx
FROM nginx:alpine

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build artifacts from the build stage to the Nginx container
COPY --from=build /app/dist/tmsclient/browser /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
