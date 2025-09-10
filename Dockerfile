# Sử dụng image Node.js chính thức (hỗ trợ ESM)
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json (nếu có)
COPY package.json ./
COPY package-lock.json ./

# Cài đặt dependencies bằng npm
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Chạy ứng dụng bằng npm start
CMD ["npm", "start"]