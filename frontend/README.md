# Zero-G Budget — giao diện React + TypeScript

Giao diện "không trọng lực" cho backend FastAPI: nền cực quang, dock nổi, thẻ kính phản ứng theo con trỏ, biểu đồ phát sáng và lệnh nhanh `Ctrl K`.

## Chạy

```bash
cd frontend
npm install
npm run dev
```

Mở http://localhost:5173. Backend mặc định ở `http://127.0.0.1:8000`, đổi bằng biến `VITE_API_URL` (xem `.env.example`).

```bash
npm run build      # kiểm tra kiểu (strict) và build ra dist/
npm run typecheck  # chỉ kiểm tra kiểu
```

## Công nghệ

Vite, React 18, TypeScript strict, React Router, TanStack Query, Framer Motion (chuyển động lò xo, tự tắt khi hệ điều hành bật giảm chuyển động), Radix UI (hộp thoại, menu, popover có sẵn hỗ trợ bàn phím), Recharts, Lucide.

## Cấu trúc

```
src/
  lib/         api.ts (gọi API, tự refresh token), format.ts, icons.tsx
  context/     Auth, Period (kỳ đang xem), Feedback (toast + hộp xác nhận)
  hooks/       queries.ts (useWallets, useReport...), ui.ts
  components/  Shell (dock, thanh trên, lệnh nhanh), fx (Aurora, GlowCard), ui, charts,
               TransactionList, TransactionModals, AIChat
  pages/       Dashboard, Transactions, Budgets, Reports, Settings, Admin, Auth
  styles/      base (token, nút, form), layout, components, pages
```

## Ghi chú

- Phiên đăng nhập dùng khóa `localStorage` `access_token`, `refresh_token`, `user_id`, `username`, `role`.
- Icon danh mục và ví mới lưu dạng `lu:<tên>` trong DB; dữ liệu cũ dạng `fa-*` hoặc `bi-*` vẫn hiển thị được nhờ bảng quy đổi trong `lib/icons.tsx`.
