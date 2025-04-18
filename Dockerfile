# Use base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the entire project
COPY . .

# Build the project
RUN npm run build

# Install a simple static server
RUN npm install -g serve

# Expose port
EXPOSE 5173

# Start the production build using serve
CMD ["serve", "-s", "dist", "-l", "5173"]