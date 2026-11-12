# Tồn Kho Xăng Dầu Anh Huy: đóng gói thành APK Android

Tên repository GitHub gợi ý: `ton-kho-xang-dau-anh-huy` (GitHub không cho dùng khoảng trắng và dấu tiếng Việt trong tên repo).

Dự án này gói ứng dụng web (thư mục `www/`) thành file APK bằng Capacitor.
Dữ liệu lưu ngay trên điện thoại (bộ nhớ của ứng dụng), không cần máy chủ.

## Cách 1: Build miễn phí trên GitHub (không cần cài gì lên máy tính)

1. Tạo tài khoản và một repository mới (private) trên github.com.
2. Tải toàn bộ nội dung thư mục này lên repository (nút "Add file" → "Upload files").
   Nhớ giữ nguyên thư mục `.github/workflows/`.
3. Vào tab **Actions** → chọn **Build APK** → **Run workflow**. Chờ khoảng 5–10 phút.
4. Mở lần chạy vừa xong → mục **Artifacts** → tải `kho-xang-dau-apk` (file zip chứa `app-debug.apk`).

## Cách 2: Build trên máy tính

Cần: Node.js 18+ (hoặc 20), JDK 17, Android Studio (để có Android SDK).

```
npm install
npx cap add android      # chỉ chạy lần đầu
npm run sync
cd android
gradlew assembleDebug    # macOS/Linux: ./gradlew assembleDebug
```
File APK nằm ở `android/app/build/outputs/apk/debug/app-debug.apk`.
Hoặc chạy `npx cap open android` để mở bằng Android Studio và bấm Run.

## Cài APK lên điện thoại

1. Chép file `app-debug.apk` sang điện thoại (Zalo, Drive, cáp USB...).
2. Mở file, nếu máy hỏi thì cho phép "Cài đặt ứng dụng từ nguồn này".
3. Mở ứng dụng "Tồn Kho Xăng Dầu Anh Huy".

APK debug đã được ký sẵn bằng khoá debug nên cài được ngay cho nội bộ.
Muốn đăng lên Google Play phải tạo bản release có khoá ký riêng.

## Cập nhật ứng dụng

Thay `www/index.html` bằng bản mới rồi build lại (cách 1: tải file lên GitHub và chạy lại workflow).
Cài đè lên bản cũ thì dữ liệu trên máy vẫn giữ nguyên, chỉ gỡ ứng dụng mới mất dữ liệu.

## Lưu ý

- Hãy xuất file Excel định kỳ để sao lưu. Trong APK, nút xuất Excel mở bảng chia sẻ để bạn lưu vào Drive/Zalo.
- Khôi phục dữ liệu bằng chức năng chọn file Excel đã xuất ra.
- Đồng bộ trực tuyến giữa các máy (kho dữ liệu của claude.ai) không có trong APK. Chuyển dữ liệu giữa các máy bằng Excel, hoặc nối Google Sheets sau.
- Đổi tên ứng dụng và mã gói trong `capacitor.config.json` (`appName`, `appId`) nếu cần.
- Đổi biểu tượng: đặt `assets/icon.png` (1024×1024) rồi chạy `npx @capacitor/assets generate --android` trước khi build.
