// Chép thư viện SheetJS vào www để app chạy được khi không có mạng
const fs=require('fs');
fs.copyFileSync('node_modules/xlsx/dist/xlsx.full.min.js','www/xlsx.full.min.js');
console.log('Đã chép xlsx.full.min.js vào www/');
