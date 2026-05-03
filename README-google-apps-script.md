# Google Apps Script Setup

ไฟล์ที่ใช้:

- [Code.gs](E:\Portfolio%20Overview\Code.gs)
- [appsscript.json](E:\Portfolio%20Overview\appsscript.json)
- [project-portfolio-app.html](E:\Portfolio%20Overview\project-portfolio-app.html)

## วิธีใช้

1. เปิด [Google Apps Script](https://script.google.com/)
2. สร้างโปรเจกต์ใหม่แบบ `Standalone`
3. วางโค้ดจาก `Code.gs`
4. ตั้งค่า `appsscript.json`
5. เพิ่มไฟล์ HTML ใหม่ชื่อ `project-portfolio-app` แล้ววางเนื้อหาจาก `project-portfolio-app.html`
6. กด `Run` ที่ฟังก์ชัน `initializeApp`

## สิ่งที่จะเกิดขึ้นตอนรันครั้งแรก

- สร้าง Google Sheet ใหม่ชื่อ `Strategic Project Portfolio Data`
- สร้างชีต `Metadata`
- สร้างชีต `Projects`
- บันทึก `Spreadsheet ID` และ `Spreadsheet URL` ไว้ใน `Script Properties`

## การเชื่อมอัตโนมัติ

- เมื่อ Deploy เป็น `Web app` แล้วเปิดหน้าแอปผ่าน URL ของ Apps Script
- หน้าเว็บจะเรียก `initializeApp()` อัตโนมัติ
- ถ้าใน Google Sheet มีข้อมูลอยู่แล้ว ระบบจะโหลดกลับเข้าแอป
- ถ้าในเบราว์เซอร์มีข้อมูล local อยู่แต่ใน Google Sheet ยังว่าง ระบบจะ push ขึ้นชีตให้อัตโนมัติ
- ทุกครั้งที่บันทึก Vision/Mission, เพิ่มโครงการ, ลบโครงการ, หรืออนุมัติโครงการ ระบบจะ sync เข้า Google Sheet อัตโนมัติ

## Deploy

1. กด `Deploy` > `New deployment`
2. เลือกประเภท `Web app`
3. `Execute as`: `Me`
4. `Who has access`: เลือกตามที่ต้องการ เช่น `Anyone with the link`
5. เปิด URL ของ Web app เพื่อใช้งาน

## หมายเหตุ

- ถ้าเปิดไฟล์ HTML ตรง ๆ จากเครื่อง ระบบจะยังทำงานแบบ `localStorage` ได้ตามเดิม
- การ sync กับ Google Sheet จะทำงานเมื่อหน้าเว็บถูกรันผ่าน Apps Script Web App เท่านั้น
