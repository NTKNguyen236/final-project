# Akademi School Dashboard

Dashboard quản lý trường học: học sinh, giáo viên, sự kiện/lịch học, và tài chính. Giao diện được xây dựng bằng React + TypeScript + Tailwind CSS, dữ liệu được lưu trữ qua REST API kết nối MongoDB.

## Kiến trúc

```
[Frontend - React + Vite]  <-- REST API -->  [Backend - Express + Mongoose]  <--> [MongoDB]
```

Repo này là phần **frontend**. Backend REST API nằm ở repo riêng: `akademi-school-dashboard-api` (xem link/thư mục backend đi kèm).

## Tính năng chính

- Quản lý học sinh: thêm, sửa, xóa, tìm kiếm, theo dõi trạng thái học phí
- Quản lý giáo viên: hồ sơ chi tiết, thông tin học vấn
- Lịch sự kiện: xem theo tuần/tháng, thêm sự kiện mới
- Quản lý tài chính: theo dõi các khoản chi tiêu của trường
- Undo khi xóa dữ liệu (khôi phục trong vòng 5 giây)

## Công nghệ sử dụng

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (hiệu ứng chuyển động)
- Lucide React (icon)

## Yêu cầu môi trường

- Node.js (khuyến nghị bản LTS mới nhất)
- Backend API đang chạy (xem hướng dẫn ở repo backend)

## Cài đặt và chạy local

1. Cài dependencies:
   ```bash
   npm install
   ```

2. Tạo file `.env` từ file mẫu:
   ```bash
   cp .env.example .env
   ```
   Chỉnh `VITE_API_BASE_URL` nếu backend không chạy ở địa chỉ mặc định.

3. Chạy app ở môi trường dev:
   ```bash
   npm run dev
   ```

4. Mở trình duyệt tại địa chỉ Vite in ra (mặc định `http://localhost:5173`)

## Build production

```bash
npm run build
```

Kết quả build nằm trong thư mục `dist/`.

## Cấu trúc thư mục

```
src/
├── components/     # Các view/component chính (Students, Teachers, Events, Finance...)
├── api.ts          # Các hàm gọi REST API
├── types.ts        # Định nghĩa TypeScript interface
├── App.tsx         # Component gốc, quản lý state toàn cục
└── main.tsx        # Entry point
```
