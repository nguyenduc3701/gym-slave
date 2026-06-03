# Cấu trúc thư mục Code - Ignite Fitness Dashboard

Dự án này sử dụng **Next.js (App Router)** kết hợp với **Mantine UI**, **Tailwind CSS** và **Zustand**. Dưới đây là cấu trúc thư mục được đề xuất để đảm bảo source code dễ bảo trì, có khả năng mở rộng tốt và phân tách rõ ràng giữa UI, State và Logic.

```text
gym-slave/
├── app/                        # Thư mục chính của Next.js App Router (Chứa Routing)
│   ├── (auth)/                 # Route group cho xác thực (login, register) - không ảnh hưởng url
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/              # Trang dashboard chính
│   │   ├── layout.tsx          # Layout riêng cho dashboard (VD: có Sidebar)
│   │   └── page.tsx            # Nội dung trang dashboard
│   ├── layout.tsx              # Root Layout (Chứa MantineProvider, Font, Meta tags)
│   ├── page.tsx                # Trang chủ (Landing page hoặc redirect)
│   └── globals.css             # File CSS global (Chứa Tailwind directives)
│
├── components/                 # Các UI Components dùng chung
│   ├── ui/                     # Các component cơ bản nhất (Buttons, Inputs, Cards...) đã được custom theo Design System
│   ├── layout/                 # Các component phục vụ cho layout (Sidebar, Header, Footer)
│   └── features/               # Các component phức tạp, mang tính nghiệp vụ (VD: WorkoutHistory, ProgressChart)
│
├── lib/                        # Các hàm tiện ích (utilities) dùng chung
│   ├── utils.ts                # Hàm hỗ trợ (VD: merge class names với clsx/tailwind-merge)
│   └── constants.ts            # Các hằng số của dự án
│
├── store/                      # Quản lý Global State với Zustand
│   ├── useAppStore.ts          # Quản lý state của UI (VD: Sidebar open/close, Theme mode)
│   └── useUserStore.ts         # Quản lý dữ liệu người dùng (Profile, Settings)
│
├── styles/                     # Cấu hình Style/Theme
│   └── theme.ts                # Cấu hình Mantine Theme (Màu sắc, Typography từ Stitch)
│
├── types/                      # Các định nghĩa kiểu dữ liệu (TypeScript Interfaces/Types)
│   └── index.ts
│
├── public/                     # Static assets (Hình ảnh, Icons, Fonts)
│   └── fonts/                  # Chứa font chữ nội bộ nếu không dùng Google Fonts
│
├── tailwind.config.ts          # Cấu hình Tailwind CSS (Định nghĩa màu sắc, spacing, typography)
├── next.config.mjs             # Cấu hình Next.js
├── tsconfig.json               # Cấu hình TypeScript
└── package.json                # Chứa các dependencies và scripts
```

## Giải thích chi tiết

1. **`app/`**: Next.js App Router hoạt động dựa trên thư mục. Bất kỳ thư mục nào có file `page.tsx` sẽ trở thành một route (VD: `app/dashboard/page.tsx` tương ứng với `/dashboard`). Các file `layout.tsx` sẽ bao bọc các trang con bên trong nó.
2. **`components/`**: 
   - Thư mục `ui/` là nơi chứa các thành phần nguyên thủy. Ví dụ: Bạn tạo một `Button.tsx` wrap lại Button của Mantine nhưng ép style theo Gradient của hệ thống thiết kế.
   - Thư mục `features/` giúp tránh việc nhồi nhét quá nhiều logic vào file `page.tsx`.
3. **`store/`**: Thay vì dùng Redux cồng kềnh, **Zustand** giúp tạo các store nhỏ gọn, dễ dàng import và sử dụng hook trực tiếp trong các component.
4. **`styles/theme.ts`**: Đây là nơi cực kỳ quan trọng để "ép" Mantine UI tuân theo Design System của Stitch (Dark Mode, màu Red/Orange, viền bo tròn 16px).
5. **`lib/utils.ts`**: Thường chứa hàm `cn()` để nối các class Tailwind lại với nhau một cách gọn gàng.

Bạn có thể tham khảo file này để biết vị trí cần thiết khi tạo mới file/thư mục nhé.
