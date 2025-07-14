# frontend/Dockerfile

FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Expose frontend port
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
