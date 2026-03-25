# Queue Booking Management System (Client)

Frontend สำหรับระบบจัดการการจองคิว พัฒนาด้วย React + TypeScript + Vite และใช้ Tailwind CSS v4

## เทคโนโลยีหลัก

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Axios
- React Hook Form + Zod

## ความต้องการก่อนเริ่ม

- Node.js 20+ (แนะนำ LTS)
- npm 10+
- ฝั่ง Server ต้องรันอยู่ที่ `http://localhost:3001`

## เริ่มต้นใช้งาน

1. ติดตั้ง dependencies

```bash
npm install
```

2. รันในโหมดพัฒนา

```bash
npm run dev
```

3. เปิดหน้าเว็บ

```text
http://localhost:5173
```

## คำสั่งสำคัญ

```bash
# รัน dev server
npm run dev

# ตรวจ lint
npm run lint

# build production
npm run build

# preview ไฟล์ build
npm run preview
```

## การเชื่อมต่อ API

ปัจจุบัน client ชี้ไปที่ server แบบค่าคงที่

- ไฟล์: `src/services/api.ts`
- baseURL: `http://localhost:3001`

ถ้าต้องการเปลี่ยนปลายทาง API ให้แก้ค่าในไฟล์ดังกล่าว

## โครงสร้างหลักของโปรเจกต์

```text
src/
  components/                 # UI component ที่ใช้ซ้ำ
  features/
    task-types/               # หน้าจัดการประเภทงาน
      components/             # ส่วนย่อยของหน้า task-types
  layouts/                    # โครง layout หลักของระบบ
  services/
    api.ts                    # รวม API call ของระบบ
  App.tsx                     # Root component
  main.tsx                    # Entry point
```

## ฟีเจอร์ที่มีในปัจจุบัน

- แสดงรายการประเภทงานที่จองผ่านเว็บไซต์
- ค้นหา/กรองข้อมูล
- เพิ่มประเภทงานพร้อมช่วงเวลา
- แก้ไขข้อมูลประเภทงาน
- ลบประเภทงาน

## หมายเหตุ

- หากเรียก API ไม่ได้ ให้ตรวจว่า server รันอยู่และพอร์ตตรงกับ `baseURL`
- หากมีปัญหา CORS ให้ตรวจการตั้งค่าในฝั่ง server (`src/main.ts`)
