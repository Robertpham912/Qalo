# Qalo Chat

Prototype giao diện cho một dịch vụ chat web riêng tư, tối giản và responsive. UI được xây dựng bằng React/Vite; Express cung cấp API prototype để gửi tin nhắn và kiểm tra trạng thái dịch vụ. Vite proxy `/api` đến server cục bộ khi phát triển.

## Chạy cục bộ

```bash
npm install
npm run dev

# terminal thứ hai — API ở cổng 3000
npm run dev:api
```

Để chạy server production sau khi build:

```bash
npm run build
npm start
```

## API prototype

- `GET /api/health` — trạng thái dịch vụ.
- `POST /api/messages` — gửi `{ "contactId": "lina", "text": "Xin chào" }`.

## Lưu ý triển khai bảo mật

Đây là bản prototype UI/API, chưa phải dịch vụ 24/7 hoàn chỉnh: tin nhắn API hiện chỉ được lưu trong bộ nhớ. Trước khi public cần bổ sung xác thực (session/Passkey), cơ sở dữ liệu mã hóa, WebSocket có xác thực, TLS/HSTS, rate limiting, logging/monitoring, backup và quy trình kiểm thử bảo mật. UI vẫn local-first: nếu API tạm không truy cập được, tin nhắn vừa gửi vẫn xuất hiện trong phiên làm việc.
