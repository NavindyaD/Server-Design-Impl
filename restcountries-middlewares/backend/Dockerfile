# Use official Node.js 18 image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies for building native modules like sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install Node.js dependencies inside the container
RUN npm install

# Copy the rest of your backend source code
COPY . .

# Expose the port your app runs on (optional, for clarity)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
