FROM node:20

WORKDIR /app

# Dependencies install karne ke liye
COPY package*.json ./
RUN npm install --build-from-source

# Saara code copy karne ke liye (SQLite ki file bhi isi mein copy ho jayegi)
COPY . .

EXPOSE 5000

# Backend server chalane ke liye
CMD ["npm", "start"]