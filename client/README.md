# Frontend React (client)

Tách giao diện EJS sang SPA React sử dụng Vite.

## Scripts
```bash
npm run dev    # chạy dev server (http://localhost:5173)
npm run build  # build production dist/
npm run preview # xem thử build
npm test       # chạy vitest ở chế độ run (CI)
npm run test:ui # chạy vitest interactive
```

## Proxy
Các request `/api` sẽ được proxy sang backend Express chạy ở `http://localhost:3000`.
Một phần CSS đã được copy sang `client/public/css/style.css` (subset). Bootstrap dùng CDN. Các ảnh vẫn proxy từ backend hoặc có thể copy dần vào `client/public/images`.

## Cấu trúc
```
client/
  src/
    pages/        # Trang (Home, ProductList, ProductDetail)
    components/   # Header, Footer
    services/     # api.js (axios instance)
    App.jsx       # định tuyến chính
    main.jsx      # bootstrap React
```

## Tiếp theo
- Copy đầy đủ ảnh cần thiết vào `client/public/images` (tuỳ chọn).
- Thêm AuthContext, bảo vệ route yêu cầu đăng nhập.
- Loại bỏ phần phụ thuộc jQuery/old plugin không còn dùng.
- Viết thêm test cho Auth (login flow) & Cart.

## Yêu cầu backend
Backend phải bật trên port 3000. Nếu khác port, sửa `vite.config.js`. Để test giả lập API có thể mock axios.
