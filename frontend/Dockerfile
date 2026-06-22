# Use a lightweight Node image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your React app code
COPY . .

# Vite defaults to port 5173
EXPOSE 5173

# Run the Vite development server with the --host flag
# This tells Vite to respond to requests coming from outside the container
CMD ["npm", "run", "dev", "--", "--host"]