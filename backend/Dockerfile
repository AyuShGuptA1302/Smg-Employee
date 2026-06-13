# Backend Dockerfile - SMG Employee Portal
FROM node:20-alpine

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --omit=dev

# Copy rest of backend source
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
