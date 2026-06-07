FROM node:20

WORKDIR /app

# Dependencies install karne ke liye
COPY package*.json ./
RUN npm install

# Saara code copy karne ke liye
COPY . .

EXPOSE 3000

# React chalane ke liye (Agar Vite use kar rahi hain toh "npm run dev" kar dein)
CMD ["npm", "start"]