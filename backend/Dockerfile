FROM node:20-bookworm-slim

# System dependencies install karein jo native modules (jaise sqlite3) ke liye chahiye hoti hain
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]