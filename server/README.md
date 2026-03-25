# Queue Booking Management System (Server)

Backend API สำหรับระบบจัดการการจองคิว พัฒนาด้วย NestJS + Prisma + PostgreSQL

## เทคโนโลยีหลัก

- NestJS 11
- Prisma 7 (Prisma Client + Prisma Adapter PG)
- PostgreSQL
- TypeScript

## ความต้องการก่อนเริ่ม

- Node.js 20+ (แนะนำ LTS)
- npm 10+
- PostgreSQL ที่พร้อมใช้งาน

## การตั้งค่า Environment

สร้างไฟล์ `.env` ในโฟลเดอร์ `server` แล้วกำหนดค่าดังนี้

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
PORT=3001
```

หมายเหตุ

- `DATABASE_URL` จำเป็น ถ้าไม่ตั้งค่าแอปจะไม่สามารถเริ่มทำงานได้
- ค่า `PORT` ไม่ใส่ก็ได้ ระบบจะใช้ `3001` เป็นค่าเริ่มต้น

## เริ่มต้นใช้งาน

1. ติดตั้ง dependencies

```bash
npm install
```

2. สร้าง Prisma Client

```bash
npx prisma generate
```

3. รัน migration ลงฐานข้อมูล (ครั้งแรก)

```bash
npx prisma migrate dev
```

4. รันเซิร์ฟเวอร์

```bash
npm run start:dev
```

## คำสั่งสำคัญ

```bash
# development (watch)
npm run start:dev

# run ปกติ
npm run start

# build
npm run build

# run production
npm run start:prod

# lint
npm run lint

# test
npm run test
npm run test:e2e
```

## API Base URL

```text
http://localhost:3001
```

## โครงสร้างโมดูลหลัก

- `branches` จัดการข้อมูลสาขา
- `task-groups` จัดการกลุ่มงาน
- `task-names` จัดการชื่องาน (ผูกกับกลุ่มงาน)
- `task-types` จัดการประเภทงานที่เปิดจองผ่านเว็บไซต์

## Endpoint หลัก

### Branches

- `GET /api/branches`
- `POST /api/branches`
- `GET /api/branches/:id`
- `PATCH /api/branches/:id`
- `DELETE /api/branches/:id`

### Task Groups

- `GET /api/task-groups`
- `POST /api/task-groups`
- `GET /api/task-groups/:id`
- `PATCH /api/task-groups/:id`
- `DELETE /api/task-groups/:id`

### Task Names

- `GET /api/task-names`
- `GET /api/task-names?groupId=<id>`
- `POST /api/task-names`
- `GET /api/task-names/:id`
- `PATCH /api/task-names/:id`
- `DELETE /api/task-names/:id`

### Task Types

- `GET /api/task-types`
- `POST /api/task-types`
- `GET /api/task-types/:id`
- `PATCH /api/task-types/:id`
- `DELETE /api/task-types/:id`

## Validation ที่สำคัญในระบบ

- ตรวจชื่อซ้ำของ Branch และ TaskGroup
- ตรวจว่า TaskName อยู่ใน TaskGroup เดียวกับที่เลือก
- ตรวจวันเวลาใน TimeSlot
  - รูปแบบเวลาถูกต้อง
  - เวลาเริ่ม < เวลาสิ้นสุด
  - ไม่มีช่วงเวลาทับซ้อนในวันเดียวกัน

## CORS

ระบบเปิด CORS ไว้แล้วใน `src/main.ts`

- origin: `*`
- methods: `GET,HEAD,PUT,PATCH,POST,DELETE`

## โครงสร้างข้อมูลหลัก (Prisma)

- `Branch`
- `TaskGroup`
- `TaskName`
- `TaskType`
- `TimeSlot`
- `DayOfWeek` enum (`SUN` ถึง `SAT`)

## Troubleshooting

### 1) รันแล้วขึ้น `DATABASE_URL is not defined`

- ตรวจว่าไฟล์ `.env` อยู่ในโฟลเดอร์ `server`
- ตรวจชื่อ key ต้องเป็น `DATABASE_URL` ตรงตัว

### 2) พอร์ตชน (`EADDRINUSE`)

- มี process อื่นใช้พอร์ตอยู่ ให้ปิด process เดิม
- หรือเปลี่ยน `PORT` ใน `.env`

### 3) Prisma schema เปลี่ยนแต่ query ยังไม่ตรง

```bash
npx prisma generate
npx prisma migrate dev
```
