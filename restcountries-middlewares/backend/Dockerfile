FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Install necessary build tools for sqlite3
RUN apt-get update && apt-get install -y python3 make g++ 

# Copy package.json files to install dependencies first (helps with caching)
COPY package*.json ./

# Install dependencies and force sqlite3 to rebuild from source
RUN npm install --build-from-source

# Copy the rest of the application files
COPY . .

# Expose the port the app will run on
EXPOSE 5000

# Command to run the app
CMD ["node", "server.js"]
